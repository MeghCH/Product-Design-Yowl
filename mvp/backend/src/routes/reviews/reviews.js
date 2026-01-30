const express = require("express");
const mysql = require("mysql2/promise");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "vscode",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_NAME || "yowl_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

router.get("/:mediaType/:mediaId", async (req, res) => {
  const { mediaType, mediaId } = req.params;

  if (!["film", "serie", "livre", "jeu"].includes(mediaType)) {
    return res.status(400).json({ msg: "Invalid media type" });
  }

  try {
    const connection = await pool.getConnection();
    const [reviews] = await connection.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.username, u.picture
             FROM Reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.media_type = ? AND r.media_id = ?
             ORDER BY r.created_at DESC`,
      [mediaType, mediaId],
    );
    connection.release();

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { mediaType, mediaId, rating, comment } = req.body;

  if (!["film", "serie", "livre", "jeu"].includes(mediaType)) {
    return res.status(400).json({ msg: "Invalid media type" });
  }

  if (!mediaId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ msg: "Invalid mediaId or rating (1-5)" });
  }

  try {
    const connection = await pool.getConnection();

    const [existing] = await connection.query(
      `SELECT id FROM Reviews WHERE user_id = ? AND media_type = ? AND media_id = ?`,
      [req.user.id, mediaType, mediaId],
    );

    if (existing.length > 0) {
      await connection.query(
        `UPDATE Reviews SET rating = ?, comment = ? WHERE user_id = ? AND media_type = ? AND media_id = ?`,
        [rating, comment || null, req.user.id, mediaType, mediaId],
      );
    } else {
      await connection.query(
        `INSERT INTO Reviews (user_id, media_type, media_id, rating, comment) VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, mediaType, mediaId, rating, comment || null],
      );
    }

    const [reviews] = await connection.query(
      `SELECT r.*, u.username FROM Reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.user_id = ? AND r.media_type = ? AND r.media_id = ?`,
      [req.user.id, mediaType, mediaId],
    );

    connection.release();
    res.status(201).json(reviews[0] || { msg: "Review saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();

    const [review] = await connection.query(
      `SELECT user_id FROM Reviews WHERE id = ?`,
      [id],
    );

    if (review.length === 0 || review[0].user_id !== req.user.id) {
      connection.release();
      return res.status(403).json({ msg: "Forbidden" });
    }

    await connection.query(`DELETE FROM Reviews WHERE id = ?`, [id]);
    connection.release();

    res.json({ msg: "Review deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
