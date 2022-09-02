const { v4: uuid } = require("uuid");

class Books {
  constructor(
    title = "",
    description = "",
    authors = "",
    favorite = "",
    fileCover = "",
    fileName = "",
    fileBook = "",
    id = uuid()
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
  }
}

const store = {
  books: [new Books()],
  user: { id: 1, mail: "test@mail.ru" },
};

module.exports = { store, Books };
