const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const mysql = require('mysql2/promise');

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
}

router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection({host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME});
const [posts] = await connection.execute(`SELECT p.*, u.id as user_id, u.username, u.email FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC`);
res.json(posts);
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection({host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME});
const [rows] = await connection.execute(`SELECT p.*, u.id as user_id, u.username, u.email FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?`, [Number(id)]);
const post = rows[0];
if (!post) return res.status(404).json({ msg: "Not found" });
res.json(post);
  } catch (err) {
    return serverError(res, err);
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const connection = await mysql.createConnection({host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME});
const [result] = await connection.execute('INSERT INTO posts (content, user_id) VALUES (?, ?)', [content, Number(req.user.id)]);
const [rows] = await connection.execute('SELECT p.*, u.id as user_id, u.username, u.email FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?', [result.insertId]);
const post = rows[0];
res.status(201).json(post);
  } catch (err) {
    return serverError(res, err);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const connection = await mysql.createConnection({host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME});
const [existingRows] = await connection.execute('SELECT * FROM posts WHERE id = ? AND user_id = ?', [Number(id), Number(req.user.id)]);
const existing = existingRows[0];
if (!existing) return res.status(404).json({ msg: "Not found" });
await connection.execute('UPDATE posts SET content = ? WHERE id = ?', [content ?? existing.content, Number(id)]);
const [rows] = await connection.execute('SELECT p.*, u.id as user_id, u.username, u.email FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?', [Number(id)]);
const updated = rows[0];
res.json(updated);
  } catch (err) {
    return serverError(res, err);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection({host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME});
const [result] = await connection.execute('DELETE FROM posts WHERE id = ? AND user_id = ?', [Number(id), Number(req.user.id)]);
if (result.affectedRows === 0) {
  return res.status(404).json({ msg: "Not found" });
}
res.json({ msg: `Successfully deleted post ${id}` });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
