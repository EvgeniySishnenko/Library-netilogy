const express = require("express");
const http = require("http");
const { store, Books } = require("../store");

const router = express.Router();

const postOptions = {
  host: "counter",
  port: "9080",
  path: "/",
  method: "POST",
};

router.get("/create", (req, res) => {
  res.render("books/create", {
    title: "Создание книги",
    book: [],
  });
});

router.get("/:id", async (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    http
      .request({
        host: "counter",
        port: "9080",
        path: `/counter/${id}/incr`,
        method: "POST",
      })
      .on("error", (err) => {
        console.error(err);
      })
      .end();

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
            resolve(JSON.parse(rowDate));
          });
        })
        .on("error", (err) => {
          console.error(err);
        });
    }).then((data) => data);

    res.render("books/view", {
      title: "Просмотр книги",
      book: books[index],
      bookViews: resultGet.incr || 0,
    });
  } else {
    res.redirect("/404");
  }
});
router.post("/delete/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    res.redirect("/books/");
  } else {
    res.redirect("/404");
  }
});

router.get("/update/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    res.render("books/update", {
      title: "Редактирование книги",
      book: books[index],
    });
  } else {
    res.redirect("/404");
  }
});

router.post("/create", (req, res) => {
  const { books } = store;
  const { title, description, authors } = req.body;
  let fileBook;
  let fileName;

  if (req.file) {
    const { path, filename } = req.file;
    fileBook = path;
    fileName = filename;
  }
  const newBook = new Books(title, description, authors, null, null, fileName, fileBook);

  books.push(newBook);
  res.redirect("/books/");
});

router.post("/update/:id", (req, res) => {
  const { books } = store;
  const { title, description, authors } = req.body;

  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    let fileBook;
    let fileName;
    if (req.file) {
      const { path, filename } = req.file;
      fileBook = path;
      fileName = filename;
    }
    books[index] = {
      ...books[index],
      title,
      description,
      authors,
      filename: fileName ? fileName : books[index].filename,
      fileBook: fileBook ? fileBook : books[index].fileBook,
    };
    res.redirect("/books/");
  } else {
    res.redirect("/404");
  }
});

module.exports = router;
