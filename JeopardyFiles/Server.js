const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("Trivia.db");

app.use(cors());
app.use(bodyParser.json());

// Create table if not exists
db.run(
  "CREATE TABLE IF NOT EXISTS Jeopardy (id INTEGER PRIMARY KEY, Questions TEXT, Answers TEXT, Hints TEXT)"
);

app.post("/add-question", (req, res) => {
  console.log("Received request to add question:", req.body); // Log the request body
  const { question, answer, hint} = req.body;
  db.run("INSERT INTO Jeopardy (Questions, Answers, Hints) VALUES (?, ?, ?)", [question, answer, hint], function(err) {
    if (err) {
      console.error("Error inserting data:", err.message); // Log the error
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// Route to get questions
app.get("/get-questions", (req, res) => {
  db.all("SELECT * FROM Jeopardy", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
//run node Server.js to get it active