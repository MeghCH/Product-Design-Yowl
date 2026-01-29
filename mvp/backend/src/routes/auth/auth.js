const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password required" });
  }

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "yowl",
    });
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ msg: "Email ou mot de passe incorrect" });
    }

    const isValid = password === (user.password_hash || user.password);

    if (!isValid) {
      return res.status(401).json({ msg: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ msg: "Email, password, and username required" });
  }

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "yowl",
    });
    const [existingRows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingRows.length > 0) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const [result] = await connection.execute(
      "INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)",
      [email, password, username],
    );
    const user = { id: result.insertId, email, username };

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res
      .status(201)
      .json({
        token,
        user: { id: user.id, email: user.email, username: user.username },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/register-test", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "yowl",
    });
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      ["test@test.com"],
    );
    if (rows.length === 0) {
      await connection.execute(
        "INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)",
        ["test@test.com", "password123", "testuser"],
      );
    } else {
      await connection.execute(
        "UPDATE users SET password_hash = ? WHERE email = ?",
        ["password123", "test@test.com"],
      );
    }

    res.json({
      msg: "Test user created/updated",
      user: { email: user.email, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
