const express = require("express");
const Books = require("../models/books");
const router = express.Router();
const http = require("http");

router.get("/books", async (req, res) => {
  try {
    const books = await Books.find().select("-__v");
    res.json(books);
  } catch (error) {
    res.redirect("/404");
  }
});

router.get("/book/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultPost = await new Promise((resolve) => {
      http
        .request(
          {
            host: "counter",
            port: "9080",
            path: `/counter/${id}/incr`,
            method: "POST",
          },
          (res) => {
            if (res.statusCode !== 200) {
              console.log(res.statusCode);
              return;
            }

            res.setEncoding("utf8");
            let rowDate = "";
            res.on("data", (chunk) => (rowDate += chunk));
            res.on("end", () => {
              resolve(rowDate);
            });
          }
        )
        .on("error", (err) => {
          console.error(err);
        })
        .end();
    });
    const resultGet = await new Promise((resolve) => {
      http
        .get(`http://counter:9080/counter/${id}`, (res) => {
          if (res.statusCode !== 200) {
            console.log(res.statusCode);
            return;
          }

          res.setEncoding("utf8");
          let rowDate = "";
          res.on("data", (chunk) => (rowDate += chunk));
          res.on("end", () => {
            resolve(rowDate);
          });
        })
        .on("error", (err) => {
          console.error(err);
        })
        .end();
    });

    const book = await Books.findById(id).select("-__v");
    res.json({ book, countView: resultGet });
  } catch (error) {
    res.status(500).json(error);
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
    res.json(newBook);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/books/:id", async (req, res) => {
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

    res.json(book);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Books.deleteOne({ _id: id });
    res.json(true);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
