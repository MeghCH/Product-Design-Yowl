const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const mysql = require("mysql2/promise");

const router = express.Router();

router.get("/:identifier", authenticateToken, async (req, res) => {
  const { identifier } = req.params;

  try {
    let where = {};
    if (!isNaN(identifier)) {
      where = { id: Number(identifier) };
    } else {
      where = { email: identifier };
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "yowl",
    });
    let query = "";
    let params = [];
    if (where.id) {
      query =
        "SELECT id, email, name, firstname, role, created_at FROM users WHERE id = ?";
      params = [where.id];
    } else {
      query =
        "SELECT id, email, name, firstname, role, created_at FROM users WHERE email = ?";
      params = [where.email];
    }
    const [rows] = await connection.execute(query, params);
    const user = rows[0];

    if (!user) return res.status(404).json({ msg: "Not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { email, password, firstname, name, currentPassword } = req.body;

  if (Number(id) !== req.user.id) {
    return res.status(403).json({ msg: "Not found" });
  }

  if (email == null || firstname == null || name == null) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    if (!currentPassword || !currentPassword.trim()) {
      return res.status(400).json({ msg: "Mot de passe actuel obligatoire" });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "yowl",
    });
    const [existingRows] = await connection.execute(
      "SELECT password FROM users WHERE id = ?",
      [Number(id)],
    );
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ msg: "Not found" });

    const isValid = currentPassword === existing.password;
    if (!isValid) {
      return res.status(401).json({ msg: "Mot de passe actuel incorrect" });
    }

    let newPassword = existing.password;
    if (typeof password === "string" && password.trim() !== "") {
      newPassword = password.trim();
    }

    await connection.execute(
      "UPDATE users SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?",
      [email, newPassword, name, firstname, Number(id)],
    );
    const [updatedRows] = await connection.execute(
      "SELECT id, email, name, firstname, role, created_at FROM users WHERE id = ?",
      [Number(id)],
    );
    const updated = updatedRows[0];
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/:id/favorites", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "vscode",
      password: "root",
      database: "yowl_db",
    });

    const [reviews] = await connection.execute(
      `SELECT r.id, r.media_type, r.media_id, r.rating, r.created_at
       FROM Reviews r
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [Number(id)],
    );

    const favorites = [];

    for (const review of reviews) {
      let mediaInfo = null;

      if (review.media_type === "film") {
        const [rows] = await connection.execute(
          "SELECT id_film as id, title, picture FROM Film WHERE id_film = ?",
          [review.media_id],
        );
        mediaInfo = rows[0];
      } else if (review.media_type === "jeu") {
        const [rows] = await connection.execute(
          "SELECT id_jeu as id, title, picture FROM Jeu_video WHERE id_jeu = ?",
          [review.media_id],
        );
        mediaInfo = rows[0];
      } else if (review.media_type === "serie") {
        const [rows] = await connection.execute(
          "SELECT id_serie as id, title, picture FROM Serie WHERE id_serie = ?",
          [review.media_id],
        );
        mediaInfo = rows[0];
      } else if (review.media_type === "livre") {
        const [rows] = await connection.execute(
          "SELECT id_livre as id, title, picture FROM Livre WHERE id_livre = ?",
          [review.media_id],
        );
        mediaInfo = rows[0];
      }

      if (mediaInfo) {
        favorites.push({
          id: review.id,
          title: mediaInfo.title,
          picture: mediaInfo.picture,
          media_type: review.media_type,
          rating: review.rating,
        });
      }
    }

    await connection.end();
    res.json(favorites);
  } catch (err) {
    console.error("Favorites error:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (Number(id) !== Number(req.user?.id)) {
    return res.status(403).json({ msg: "Forbidden" });
  }

  try {
    await connection.execute("DELETE FROM todos WHERE user_id = ?", [
      Number(id),
    ]);
    await connection.execute("DELETE FROM users WHERE id = ?", [Number(id)]);

    res.json({ msg: `Successfully deleted record number: ${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
