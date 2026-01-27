const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const db = require("../../db");

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
}

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, created_at, user_id FROM playlists WHERE user_id = ? ORDER BY created_at DESC",
      [Number(req.user.id)]
    );

    res.json(rows);
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      "SELECT id, name, created_at, user_id FROM playlists WHERE id = ? AND user_id = ?",
      [Number(id), Number(req.user.id)]
    );

    if (rows.length === 0) return res.status(404).json({ msg: "Not found" });

    res.json(rows[0]);
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
    const [result] = await db.execute(
      "INSERT INTO playlists (name, user_id) VALUES (?, ?)",
      [name, Number(req.user.id)]
    );

    const [rows] = await db.execute(
      "SELECT id, name, created_at, user_id FROM playlists WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    return serverError(res, err);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {

    const [existingRows] = await db.execute(
      "SELECT id, name FROM playlists WHERE id = ? AND user_id = ?",
      [Number(id), Number(req.user.id)]
    );

    if (existingRows.length === 0) return res.status(404).json({ msg: "Not found" });

    const existingName = existingRows[0].name;
    const newName = name ?? existingName;

    await db.execute(
      "UPDATE playlists SET name = ? WHERE id = ? AND user_id = ?",
      [newName, Number(id), Number(req.user.id)]
    );

    const [rows] = await db.execute(
      "SELECT id, name, created_at, user_id FROM playlists WHERE id = ?",
      [Number(id)]
    );

    res.json(rows[0]);
  } catch (err) {
    return serverError(res, err);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      "DELETE FROM playlists WHERE id = ? AND user_id = ?",
      [Number(id), Number(req.user.id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json({ msg: `Successfully deleted playlist ${id}` });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
