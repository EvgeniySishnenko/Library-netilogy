const express = require("express");

const { start } = require("./config/");
const booksRouter = require("./routes/books");
const authRouter = require("./routes/auth");

const app = express();
app.use(express.json());
app.use("/api", booksRouter);
app.use("/api", authRouter);

app.use("/public", express.static(__dirname + "/public"));

const PORT = start.PORT;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
