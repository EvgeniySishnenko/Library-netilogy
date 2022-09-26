const express = require("express");
const { start } = require("./config/");

const app = express();

app.get("/counter/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const incr = 1;
    res.json({ incr });
  } catch (error) {
    res.statusCode(500).json({ message: "error Redis" });
  }
});

app.post("/counter/:bookId/incr", async (req, res) => {
  try {
    const { bookId } = req.params;
    const incr = 1;
    res.json({ incr });
  } catch (error) {
    res.statusCode(500).json({ message: "error Redis" });
  }
});

const PORT = start.PORT;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
