const { Schema, model } = require("mongoose");

const counterSchema = new Schema({
  count: {
    type: Number,
    require: true,
    default: 0,
  },
  bookId: {
    type: String,
    require: true,
  },
});

module.exports = model("Counter", counterSchema);
