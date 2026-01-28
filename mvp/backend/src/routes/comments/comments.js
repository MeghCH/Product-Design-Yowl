const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const mysql = require('mysql2/promise');

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
}

router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const connection = await mysql.createConnection({host: 'localhost', user: 'root', database: 'yowl'});
    const [comments] = await connection.execute(`SELECT c.*, u.id as user_id, u.username, u.email FROM commentaires c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC`, [Number(postId)]);
    res.json(comments);
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection({host: 'localhost', user: 'root', database: 'yowl'});
    const [rows] = await connection.execute(`SELECT c.*, u.id as user_id, u.username, u.email, p.id as post_id, p.content as post_content FROM commentaires c JOIN users u ON c.user_id = u.id JOIN posts p ON c.post_id = p.id WHERE c.id = ?`, [Number(id)]);
    const comment = rows[0];
    if (!comment) return res.status(404).json({ msg: "Not found" });

    res.json(comment);
  } catch (err) {
    return serverError(res, err);
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { post_id, content } = req.body;

  if (!post_id || !content) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const connection = await mysql.createConnection({host: 'localhost', user: 'root', database: 'yowl'});
    const [result] = await connection.execute('INSERT INTO commentaires (post_id, content, user_id) VALUES (?, ?, ?)', [Number(post_id), content, Number(req.user.id)]);
    const [rows] = await connection.execute(`SELECT c.*, u.id as user_id, u.username, u.email FROM commentaires c JOIN users u ON c.user_id = u.id WHERE c.id = ?`, [result.insertId]);
    const comment = rows[0];
    res.status(201).json(comment);
  } catch (err) {
    return serverError(res, err);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const connection = await mysql.createConnection({host: 'localhost', user: 'root', database: 'yowl'});
    const [existingRows] = await connection.execute('SELECT * FROM commentaires WHERE id = ? AND user_id = ?', [Number(id), Number(req.user.id)]);
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ msg: "Not found" });
    
    const newContent = content ?? existing.content;
    await connection.execute('UPDATE commentaires SET content = ? WHERE id = ?', [newContent, Number(id)]);
    const [rows] = await connection.execute(`SELECT c.*, u.id as user_id, u.username, u.email FROM commentaires c JOIN users u ON c.user_id = u.id WHERE c.id = ?`, [Number(id)]);
    const updated = rows[0];
    res.json(updated);
  } catch (err) {
    return serverError(res, err);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection({host: 'localhost', user: 'root', database: 'yowl'});
    const [result] = await connection.execute('DELETE FROM commentaires WHERE id = ? AND user_id = ?', [Number(id), Number(req.user.id)]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json({ msg: `Successfully deleted comment ${id}` });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
