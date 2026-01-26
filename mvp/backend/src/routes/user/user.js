const express = require("express");
const bcrypt = require("bcryptjs");
const { authenticateToken } = require("../../middleware/auth");
const db = require("../../db");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, email, name, firstname, role, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ msg: "Not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/todos", authenticateToken, async (req, res) => {
  res.json([]);
});

router.get("/:identifier", authenticateToken, async (req, res) => {
  const { identifier } = req.params;

  try {
    let query = "SELECT id, email, name, firstname, role, created_at FROM users WHERE ";
    let params = [];

    if (!isNaN(identifier)) {
      query += "id = ?";
      params = [Number(identifier)];
    } else {
      query += "email = ?";
      params = [identifier];
    }

    const [rows] = await db.execute(query, params);

    if (rows.length === 0) return res.status(404).json({ msg: "Not found" });

    res.json(rows[0]);
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

    const [existingRows] = await db.execute(
      "SELECT password_hash FROM users WHERE id = ?",
      [Number(id)]
    );
    if (existingRows.length === 0) return res.status(404).json({ msg: "Not found" });

    const isValid = await bcrypt.compare(currentPassword, existingRows[0].password_hash);
    if (!isValid) {
      return res.status(401).json({ msg: "Mot de passe actuel incorrect" });
    }

    let hashed = existingRows[0].password_hash;
    if (typeof password === "string" && password.trim() !== "") {
      hashed = await bcrypt.hash(password.trim(), 10);
    }

    await db.execute(
      "UPDATE users SET email = ?, password_hash = ?, name = ?, firstname = ? WHERE id = ?",
      [email, hashed, name, firstname, Number(id)]
    );

    const [updatedRows] = await db.execute(
      "SELECT id, email, name, firstname, role, created_at FROM users WHERE id = ?",
      [Number(id)]
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (Number(id) !== Number(req.user?.id)) {
    return res.status(403).json({ msg: "Forbidden" });
  }

  try {
    await db.execute("DELETE FROM commentaire WHERE user_id = ?", [Number(id)]);
    await db.execute("DELETE FROM posts WHERE user_id = ?", [Number(id)]);
    await db.execute("DELETE FROM playlists WHERE user_id = ?", [Number(id)]);
    await db.execute("DELETE FROM users WHERE id = ?", [Number(id)]);

    res.json({ msg: `Successfully deleted record number: ${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
