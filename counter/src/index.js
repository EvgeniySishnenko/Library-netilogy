const express = require("express");
const { start } = require("./config/");
const redis = require("redis");

const app = express();
const REDIS_URL = process.env.REDIS_URL || "localhost";

const client = redis.createClient({ url: REDIS_URL });

(async () => {
  await client.connect();
})();

app.get("/counter/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const incr = await client.get(bookId);
    res.json({ incr });
  } catch (error) {
    res.statusCode(500).json({ message: "error Redis" });
  }
});

app.post("/counter/:bookId/incr", async (req, res) => {
  try {
    const { bookId } = req.params;
    const incr = await client.incr(bookId);
    res.json({ incr });
  } catch (error) {
    res.statusCode(500).json({ message: "error Redis" });
  }
});

const PORT = start.PORT;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
