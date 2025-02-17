const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const socketIO = require("socket.io");
const http = require("http");
const { start } = require("./config/");
const apiBooksRouter = require("./routes/apiBooks");
const authRouter = require("./routes/auth");
const homeRouter = require("./routes/home");
const booksRouter = require("./routes/books");
const errorMiddleware = require("./middleware/error");
const fileMulter = require("./middleware/file");
const User = require("./models/user");
const app = express();

const server = http.Server(app);
const io = socketIO(server);

const verify = async (email, password, done) => {
  try {
    const candidate = await User.findOne({ email, password });
    if (!candidate) return done(null, false);
    return done(null, candidate);
  } catch (error) {
    return done(error);
  }
};

const options = {
  usernameField: "email",
  passwordField: "password",
};

passport.use("local", new LocalStrategy(options, verify));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser(async (id, cb) => {
  try {
    const candidate = await User.findById(id);
    if (!candidate) cb(null, false);
    cb(null, candidate);
  } catch (error) {
    cb(error);
  }
});

app.use(fileMulter.single("fileBook"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/"));
app.use(express.urlencoded({ extended: true }));
app.use("/src/public/img", express.static(path.join(__dirname, "src/public/img")));

app.use(
  session({
    secret: "cookie_secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", homeRouter);
app.use("/api", authRouter);
app.use("/api", apiBooksRouter);
app.use("/", booksRouter);
app.use(errorMiddleware);

io.on("connection", (socket) => {
  const { id } = socket;

  /** Сообщение на странице книги */
  const { roomName } = socket.handshake.query;
  socket.join(roomName);
  socket.on("comment-book", (comment) => {
    socket.to(roomName).emit("comment-book", comment);
    socket.emit("comment-book", comment);
  });
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${id}`);
  });
});

const PORT = start.PORT;

async function bootstrap() {
  try {
    await mongoose.connect("mongodb://root:example@mongo:27017/");

    server.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
