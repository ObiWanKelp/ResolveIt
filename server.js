const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5050;

app.use(cors());
app.use(bodyParser.json());

// === MySQL Connection ===
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "resolve_it",
});

db.connect((err) => {
  if (err) console.error("❌ MySQL connection failed:", err);
  else console.log("✅ Connected to MySQL!");
});

// === LOGIN ===
app.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ? AND role = ?",
    [email, role],
    (err, results) => {
      if (err)
        return res.status(500).json({ success: false, message: "DB error" });
      if (results.length === 0)
        return res
          .status(401)
          .json({ success: false, message: "User not found" });

      const user = results[0];
      if (user.password !== password)
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password" });

      res.json({ success: true, role: user.role });
    }
  );
});

// === Add Issue (student) ===
app.post("/add-issue", (req, res) => {
  const { email, campus, location, category, description } = req.body;
  const sql =
    "INSERT INTO issues (email, campus, location, category, description) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [email, campus, location, category, description], (err) => {
    if (err) {
      console.error("❌ SQL Insert Error:", err);
      res.status(500).send("❌ Failed to add issue");
    } else {
      res.send("✅ Issue added successfully!");
    }
  });
});

// === Get All Issues ===
app.get("/issues", (req, res) => {
  db.query("SELECT * FROM issues ORDER BY id DESC", (err, results) => {
    if (err) res.status(500).send("❌ Failed to fetch issues");
    else res.json(results);
  });
});

// === Update Issue Status (staff/admin) ===
app.put("/update-status/:id", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  db.query("UPDATE issues SET status = ? WHERE id = ?", [status, id], (err) => {
    if (err) res.status(500).send("❌ Failed to update");
    else res.send("✅ Status updated!");
  });
});

// === Delete Issue (admin only) ===
app.delete("/delete-issue/:id", (req, res) => {
  db.query("DELETE FROM issues WHERE id = ?", [req.params.id], (err) => {
    if (err) res.status(500).send("❌ Failed to delete issue");
    else res.send("✅ Issue deleted!");
  });
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
