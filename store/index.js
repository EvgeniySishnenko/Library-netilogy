const Books = require("../models/books");

const store = {
  books: [],
  user: { id: 1, mail: "test@mail.ru" },
};

module.exports = { store, Books };
