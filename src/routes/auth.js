const express = require("express");
const User = require("../models/user");
const { store } = require("../store");

const router = express.Router();

router.post("/user/login", (req, res) => {
  res.render("auth/login", {
    title: "Авторизуйтесь или зарегистрируйтесь ",
  });
});

router.post("/user/me", (req, res) => {
  res.render("auth/login", {
    title: "Авторизуйтесь или зарегистрируйтесь ",
  });
});

module.exports = router;
