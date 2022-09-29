const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, require: true },
  name: String,
  password: { type: String, require: true },
});

module.exports = model("User", userSchema);
