const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const mysql = require('mysql2/promise');

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
}

router.get("/", authenticateToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection({host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME});
    const [playlists] = await connection.execute('SELECT id, name, created_at, user_id FROM playlists WHERE user_id = ? ORDER BY created_at DESC', [Number(req.user.id)]);
    res.json(playlists);
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection({host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME});
    const [rows] = await connection.execute('SELECT id, name, created_at, user_id FROM playlists WHERE id = ? AND user_id = ?', [Number(id), Number(req.user.id)]);
    const playlist = rows[0];
    if (!playlist) return res.status(404).json({ msg: "Not found" });

    res.json(playlist);
  } catch (err) {
    return serverError(res, err);
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const connection = await mysql.createConnection({host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME});
    const [result] = await connection.execute('INSERT INTO playlists (name, user_id) VALUES (?, ?)', [name, Number(req.user.id)]);
    const [rows] = await connection.execute('SELECT id, name, created_at, user_id FROM playlists WHERE id = ?', [result.insertId]);
    const playlist = rows[0];
    res.status(201).json(playlist);
  } catch (err) {
    return serverError(res, err);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const connection = await mysql.createConnection({host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME});
    const [existingRows] = await connection.execute('SELECT * FROM playlists WHERE id = ? AND user_id = ?', [Number(id), Number(req.user.id)]);
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ msg: "Not found" });
    
    const newName = name ?? existing.name;
    await connection.execute('UPDATE playlists SET name = ? WHERE id = ?', [newName, Number(id)]);
    const [rows] = await connection.execute('SELECT id, name, created_at, user_id FROM playlists WHERE id = ?', [Number(id)]);
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
    const [result] = await connection.execute('DELETE FROM playlists WHERE id = ? AND user_id = ?', [Number(id), Number(req.user.id)]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json({ msg: `Successfully deleted playlist ${id}` });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
