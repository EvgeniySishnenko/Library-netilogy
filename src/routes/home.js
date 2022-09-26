const express = require("express");
const router = express.Router();
const Books = require("../models/books");
const http = require("http");

const postOptions = {
  host: "counter",
  port: "9080",
  path: "/",
  method: "POST",
};

router.get("/", (req, res) => {
  res.render("index", {
    title: "Главная",
  });
});

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

router.get("/book/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // http
    //   .request({
    //     host: "counter",
    //     port: "9080",
    //     path: `/counter/${id}/incr`,
    //     method: "POST",
    //   })
    //   .on("error", (err) => {
    //     console.error(err);
    //   })
    //   .end();

    // const resultGet = await new Promise((resolve) => {
    //   http
    //     .get(`http://counter:9080/counter/${id}`, (res) => {
    //       if (res.statusCode !== 200) {
    //         console.log(res.statusCode);
    //         return;
    //       }

    //       res.setEncoding("utf8");
    //       let rowDate = "";
    //       res.on("data", (chunk) => (rowDate += chunk));
    //       res.on("end", () => {
    //         resolve(JSON.parse(rowDate));
    //       });
    //     })
    //     .on("error", (err) => {
    //       console.error(err);
    //     });
    // }).then((data) => data);
    const book = await Books.findById(id).select("__v");
    res.render("books/view", {
      title: "Просмотр книги",
      book,
      bookViews: 1,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
