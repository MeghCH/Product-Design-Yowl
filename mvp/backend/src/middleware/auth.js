const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ msg: "Access token required" });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid token" });
    }

    req.user = user;
    next();
  });
}

router.post("/register", async (req, res) => {
  const { email, password, name, firstname, role } = req.body;

  if (
    !email ||
    !password ||
    !name ||
    !firstname ||
    !["employe", "manager"].includes(role)
  ) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(409).json({ msg: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (email, password_hash, name, firstname, role) VALUES (?, ?, ?, ?, ?)",
      [email, hashedPassword, name, firstname, role]
    );

    const newUser = {
      id: result.insertId,
      email,
      name,
      firstname,
      role,
      created_at: new Date(),
    };

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, email, password_hash, name, firstname, role, created_at FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      firstname: user.firstname,
      role: user.role,
      created_at: user.created_at,
    };

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = { authenticateToken, router };
=======
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ msg: "Access token required" });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid token" });
    }

    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
