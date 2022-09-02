const express = require("express");

const { store, Books } = require("../store");
const fileMulter = require("../middleware/file");
const router = express.Router();

router.get("/books", (req, res) => {
  const { books } = store;
  res.json(books);
});

router.get("/books/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    res.json(books[index]);
  } else {
    res.status(404);
    res.json({ errorCode: 404, message: "Книга не найдена" });
  }
});

router.post("/books", fileMulter.single("pictureForBook"), (req, res) => {
  const { books } = store;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;

  let fileBook;

  if (req.file) {
    const { path } = req.file;
    fileBook = path;
  }

  const newBook = new Books(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  );

  books.push(newBook);
  res.json(newBook);
});

router.put("/books/:id", fileMulter.single("pictureForBook"), (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    let fileBook;

    if (req.file) {
      const { path } = req.file;
      fileBook = path;
    }
    books[index] = {
      ...books[index],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook: fileBook ? fileBook : books[index].fileBook,
    };
    res.json(books[index]);
  } else {
    res.status(404);
    res.json({ errorCode: 404, message: "Книга не найдена" });
  }
});

router.delete("/books/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    res.json("ok");
  } else {
    res.status(404);
    res.json({ errorCode: 404, message: "Книга не найдена" });
  }
});

router.get("/books/:id/download", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    res.sendFile(`${books[index].fileBook}`, { root: "." });
  } else {
    res.status(404);
    res.json({ errorCode: 404, message: "Файл не найден" });
  }
});

module.exports = router;
