const express = require("express");

const { store, Books } = require("../store");

const router = express.Router();

[1, 2, 3].map((el) => {
  const newBooks = new Books(`Book ${el}`, `desc Book ${el}`, `authors  ${el}`);
  store.books.push(newBooks);
});

router.get("/", (req, res) => {
  const { books } = store;
  res.render("books/index", {
    title: "Книги",
    books,
  });
});

module.exports = router;
