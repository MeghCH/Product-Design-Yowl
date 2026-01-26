const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const db = require("../../db");

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
}

router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const [rows] = await db.execute(`
      SELECT c.id, c.content, c.created_at, c.post_id, c.user_id,
             u.id as user_id, u.username, u.email
      FROM commentaire c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [Number(postId)]);

    const comments = rows.map(row => ({
      id: row.id,
      content: row.content,
      created_at: row.created_at,
      post_id: row.post_id,
      user: {
        id: row.user_id,
        username: row.username,
        email: row.email,
      },
    }));

    res.json(comments);
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(`
      SELECT c.id, c.content, c.created_at, c.post_id, c.user_id,
             u.id as user_id, u.username, u.email,
             p.id as post_id, p.content as post_content
      FROM commentaire c
      JOIN users u ON c.user_id = u.id
      JOIN posts p ON c.post_id = p.id
      WHERE c.id = ?
    `, [Number(id)]);

    if (rows.length === 0) return res.status(404).json({ msg: "Not found" });

    const comment = {
      id: rows[0].id,
      content: rows[0].content,
      created_at: rows[0].created_at,
      user: {
        id: rows[0].user_id,
        username: rows[0].username,
        email: rows[0].email,
      },
      post: {
        id: rows[0].post_id,
        content: rows[0].post_content,
      },
    };

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
    const [result] = await db.execute(
      "INSERT INTO commentaire (post_id, content, user_id) VALUES (?, ?, ?)",
      [Number(post_id), content, Number(req.user.id)]
    );

    const [rows] = await db.execute(`
      SELECT c.id, c.content, c.created_at, c.post_id, c.user_id,
             u.id as user_id, u.username, u.email
      FROM commentaire c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.insertId]);

    const comment = {
      id: rows[0].id,
      content: rows[0].content,
      created_at: rows[0].created_at,
      post_id: rows[0].post_id,
      user_id: rows[0].user_id,
      user: {
        id: rows[0].user_id,
        username: rows[0].username,
        email: rows[0].email,
      },
    };

    res.status(201).json(comment);
  } catch (err) {
    return serverError(res, err);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const [existingRows] = await db.execute(
      "SELECT id, content FROM commentaire WHERE id = ? AND user_id = ?",
      [Number(id), Number(req.user.id)]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    await db.execute(
      "UPDATE commentaire SET content = ? WHERE id = ?",
      [content ?? existingRows[0].content, Number(id)]
    );
    const [rows] = await db.execute(`
      SELECT c.id, c.content, c.created_at, c.post_id, c.user_id,
             u.id as user_id, u.username, u.email
      FROM commentaire c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [Number(id)]);

    const updatedComment = {
      id: rows[0].id,
      content: rows[0].content,
      created_at: rows[0].created_at,
      post_id: rows[0].post_id,
      user_id: rows[0].user_id,
      user: {
        id: rows[0].user_id,
        username: rows[0].username,
        email: rows[0].email,
      },
    };

    res.json(updatedComment);
  } catch (err) {
    return serverError(res, err);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      "DELETE FROM commentaire WHERE id = ? AND user_id = ?",
      [Number(id), Number(req.user.id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json({ msg: `Successfully deleted comment ${id}` });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
