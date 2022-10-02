const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { start } = require("./config/");
const booksRouter = require("./routes/books");
const authRouter = require("./routes/auth");
const homeRouter = require("./routes/home");
const errorMiddleware = require("./middleware/error");
const fileMulter = require("./middleware/file");
const User = require("./models/user");

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
const app = express();

app.use(fileMulter.single("fileBook"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/"));
app.use(express.urlencoded({ extended: true }));
app.use("/public/img", express.static(path.join(__dirname, "public/img")));

app.use(session({ secret: "SECRET" }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", homeRouter);
app.use("/api", authRouter);
app.use("/api", booksRouter);

app.use(errorMiddleware);

const PORT = start.PORT;

async function bootstrap() {
  try {
    await mongoose.connect("mongodb://root:example@mongo:27017/");

    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
