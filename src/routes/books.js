const express = require("express");
const Books = require("../models/books");
const router = express.Router();

router.get("/books", (req, res) => {
  try {
    res.render("books/create", {
      title: "Создание книги",
      book: [],
    });
  } catch (error) {
    res.redirect("/404");
  }
});

router.post("/books", async (req, res) => {
  const { title, description, authors } = req.body;
  let fileBook;
  let fileName;

  if (req.file) {
    const { path, filename } = req.file;
    fileBook = path;
    fileName = filename;
  }
  const newBook = new Books({ title, description, authors, fileName, fileBook });

  try {
    await newBook.save();
    res.redirect("/books");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Books.findById(id).select("__v");

    res.render("books/update", {
      title: "Редактирование книги",
      book,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Book.deleteOne({ _id: id });
    res.redirect("/books/");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/books/:id", async (req, res) => {
  const { title, description, authors } = req.body;
  const { id } = req.params;
  try {
    const book = Books.findById(id).select("__v");

    let fileBook;
    let fileName;

    if (req.file) {
      const { path, filename } = req.file;
      fileBook = path;
      fileName = filename;
    }
    const newBook = {
      title,
      description,
      authors,
      filename: fileName ? fileName : book.filename,
      fileBook: fileBook ? fileBook : book.fileBook,
    };
    console.log(newBook);
    await Books.findByIdAndUpdate(id, newBook);

    res.redirect("/books");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
