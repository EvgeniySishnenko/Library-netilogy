const express = require("express");
const { v4: uuid } = require("uuid");

class Books {
  constructor(
    title = "",
    description = "",
    authors = "",
    favorite = "",
    fileCover = "",
    fileName = "",
    id = uuid()
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
  }
}

const store = {
  books: [new Books()],
  user: { id: 1, mail: "test@mail.ru" },
};

const app = express();
app.use(express.json());

app.post("/api/user/login", (req, res) => {
  const { user } = store;
  const { mail } = req.body;
  const isAuth = user.mail === mail;
  if (isAuth) {
    res.status(201);
    res.json(user);
  } else {
    res.status(404);
  }
});

app.get("/api/books", (req, res) => {
  const { books } = store;
  res.json(books);
});

app.get("/api/books/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    res.json(books[index]);
  } else {
    res.status(404);
  }
});

app.post("/api/books", (req, res) => {
  const { books } = store;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const newBook = new Books(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  );
  books.push(newBook);
  res.json(newBook);
});

app.put("/api/books/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
    };
    res.json(books[index]);
  } else {
    res.status(404);
  }
});

app.delete("/api/books/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    res.json("ok");
  } else {
    res.status(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
