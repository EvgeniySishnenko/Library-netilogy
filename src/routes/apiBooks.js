const express = require("express");
const Books = require("../models/books");
const router = express.Router();

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

router.post("/books/:id", async (req, res) => {
  const { title, description, authors } = req.body;
  const { id } = req.params;
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
    filename: fileName,
    fileBook: fileBook,
  };

  try {
    const book = await Books.findByIdAndUpdate(id, newBook);

    res.redirect("/books");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/books/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Books.deleteOne({ _id: id });
    res.redirect("/books");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
