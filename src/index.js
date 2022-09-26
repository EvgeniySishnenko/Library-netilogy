const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { start } = require("./config/");
const booksRouter = require("./routes/books");
const authRouter = require("./routes/auth");
const homeRouter = require("./routes/home");
const errorMiddleware = require("./middleware/error");
const fileMulter = require("./middleware/file");

const app = express();

app.use(fileMulter.single("fileBook"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/"));

app.use("/public/img", express.static(path.join(__dirname, "public/img")));
app.use("/api", booksRouter);
app.use("/api", authRouter);
app.use("/", homeRouter);

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
