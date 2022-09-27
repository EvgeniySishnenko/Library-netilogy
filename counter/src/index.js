const express = require("express");
const mongoose = require("mongoose");
const { start } = require("./config/");
const Counter = require("./models/counter");

const app = express();

app.get("/counter/:bookId", async (req, res) => {
  const { bookId } = req.params;
  try {
    const count = await Counter.find({ bookId: bookId });

    if (count[0]?.bookId !== bookId) {
      const newCounter = new Counter({
        count: 1,
        bookId,
      });
      await newCounter.save();
      res.json(newCounter.count);
    } else {
      res.json(count[0]?.count);
    }
  } catch (error) {
    res.status(500).json({ message: "error mongo" });
  }
});

app.post("/counter/:bookId/incr", async (req, res) => {
  const { bookId } = req.params;

  try {
    const count = await Counter.find({ bookId: bookId });
    if (count[0]?.bookId !== bookId) {
      const newCounter = new Counter({
        count: 1,
        bookId,
      });
      await newCounter.save();
      res.json(newCounter.count);
    } else {
      const num = Number(count[0]?.count) + 1;
      const newCount = await Counter.findOneAndUpdate(
        { bookId: bookId },
        { count: num },
        {
          new: true,
        }
      );
      res.json(newCount.count);
    }
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
});

const PORT = start.PORT;

async function bootstrap() {
  try {
    await mongoose.connect("mongodb://root:example@mongo:27017/");
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
