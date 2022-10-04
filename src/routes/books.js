const express = require("express");
const Books = require("../models/books");
const http = require("http");
const router = express.Router();

router.get("/books", async (req, res) => {
  try {
    const books = await Books.find().select("-__v");
    res.render("books/index", {
      title: "Книги",
      books,
    });
  } catch (error) {
    res.redirect("/404");
  }
});

router.get("/create", (req, res) => {
  res.render("books/create", {
    title: "Создание книги",
    book: [],
  });
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

    res.render("books/view", {
      title: "Просмотр книги",
      book,
      bookViews: resultGet,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Books.findById(id).select("-__v");

    res.render("books/update", {
      title: "Редактирование книги",
      book,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
