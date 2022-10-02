const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const router = express.Router();

router.get("/user/login", async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация/Регистрация",
  });
});

router.get(
  "/user/me",
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/api/user/login");
    }
    next();
  },
  async (req, res) => {
    res.render("auth/profile", {
      title: "Профиль пользователя",
      user: req.user,
    });
  }
);

router.post("/user/login", passport.authenticate("local", { failureRedirect: "/api/user/login" }), async (req, res) => {
  res.redirect("/");
});

router.post("/user/signup", async (req, res) => {
  const { remail, rname, rpassword } = req.body;
  const newUser = new User({ email: remail, name: rname, password: rpassword });
  try {
    await newUser.save();

    res.redirect("/");
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/user/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
module.exports = router;
