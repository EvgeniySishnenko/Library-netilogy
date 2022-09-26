const { Schema, model } = require("mongoose");

const booksSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  authors: {
    type: String,
    require: true,
  },
  favorite: {
    type: String,
  },
  fileCover: {
    type: String,
    require: true,
  },
  fileName: {
    type: String,
    require: true,
  },
});

module.exports = model("Books", booksSchema);
