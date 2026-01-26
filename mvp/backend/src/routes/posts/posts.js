const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const db = require("../../db");

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
}

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.id, p.content, p.created_at, p.user_id,
             u.id as user_id, u.username, u.email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);

    const posts = rows.map(row => ({
      id: row.id,
      content: row.content,
      created_at: row.created_at,
      user: {
        id: row.user_id,
        username: row.username,
        email: row.email,
      },
    }));

    res.json(posts);
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(`
      SELECT p.id, p.content, p.created_at, p.user_id,
             u.id as user_id, u.username, u.email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [Number(id)]);

    if (rows.length === 0) return res.status(404).json({ msg: "Not found" });

    const post = {
      id: rows[0].id,
      content: rows[0].content,
      created_at: rows[0].created_at,
      user: {
        id: rows[0].user_id,
        username: rows[0].username,
        email: rows[0].email,
      },
    };

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
    const [result] = await db.execute(
      "INSERT INTO posts (content, user_id) VALUES (?, ?)",
      [content, Number(req.user.id)]
    );

    const [rows] = await db.execute(`
      SELECT p.id, p.content, p.created_at, p.user_id,
             u.id as user_id, u.username, u.email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [result.insertId]);

    const post = {
      id: rows[0].id,
      content: rows[0].content,
      created_at: rows[0].created_at,
      user: {
        id: rows[0].user_id,
        username: rows[0].username,
        email: rows[0].email,
      },
    };

    res.status(201).json(post);
  } catch (err) {
    return serverError(res, err);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const [existingRows] = await db.execute(
      "SELECT id, content FROM posts WHERE id = ? AND user_id = ?",
      [Number(id), Number(req.user.id)]
    );

    if (existingRows.length === 0) return res.status(404).json({ msg: "Not found" });

    const newContent = content ?? existingRows[0].content;

    await db.execute(
      "UPDATE posts SET content = ? WHERE id = ? AND user_id = ?",
      [newContent, Number(id), Number(req.user.id)]
    );

    const [rows] = await db.execute(`
      SELECT p.id, p.content, p.created_at, p.user_id,
             u.id as user_id, u.username, u.email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [Number(id)]);

    const updated = {
      id: rows[0].id,
      content: rows[0].content,
      created_at: rows[0].created_at,
      user: {
        id: rows[0].user_id,
        username: rows[0].username,
        email: rows[0].email,
      },
    };

    res.json(updated);
  } catch (err) {
    return serverError(res, err);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      "DELETE FROM posts WHERE id = ? AND user_id = ?",
      [Number(id), Number(req.user.id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json({ msg: `Successfully deleted post ${id}` });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
