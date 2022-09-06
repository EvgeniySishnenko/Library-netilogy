const express = require("express");
const path = require("path");
const { start } = require("./config/");
const homeRouter = require("./routes/home");
const booksRouter = require("./routes/books");
const bookRouter = require("./routes/book");
const authRouter = require("./routes/auth");

const errorMiddleware = require("./middleware/error");
const fileMulter = require("./middleware/file");

const app = express();

app.use(fileMulter.single("fileBook"));

app.set("view engine", "ejs");

app.use("/public/img", express.static(path.join(__dirname, "public/img")));

app.use("/", homeRouter);
app.use("/books", booksRouter);
app.use("/book", bookRouter);
app.use("/api", authRouter);

app.use(errorMiddleware);

const PORT = start.PORT;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
