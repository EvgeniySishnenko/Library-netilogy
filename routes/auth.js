const express = require("express");

const { store } = require("../store");

const router = express.Router();

router.post("/user/login", (req, res) => {
  const { user } = store;
  const { mail } = req.body;
  const isAuth = user.mail === mail;
  if (isAuth) {
    res.status(201);
    res.json(user);
  } else {
    res.status(404);
    res.json({ errorCode: 404, message: "Ошибка авторизации" });
  }
});

module.exports = router;
