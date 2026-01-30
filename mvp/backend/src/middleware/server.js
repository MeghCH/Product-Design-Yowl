const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "vscode",
  password: "root",
  database: "yowl_db",
});

db.connect((err) => {
  if (err) {
    console.error("Erreur MySQL :", err.message);
  } else {
    console.log("Connecté à la DB");
  }
});

app.get("/api/home", async (req, res) => {
  try {
    const [games] = await db
      .promise()
      .query(
        "SELECT id_jeu AS id, title, picture, created_at FROM Jeu_video ORDER BY created_at DESC LIMIT 5",
      );

    const [movies] = await db
      .promise()
      .query(
        "SELECT id_film AS id, title, picture, created_at FROM Film ORDER BY created_at DESC LIMIT 5",
      );

    const [tvShows] = await db
      .promise()
      .query(
        "SELECT id_serie AS id, title, picture, created_at FROM Serie ORDER BY created_at DESC LIMIT 5",
      );

    const [books] = await db
      .promise()
      .query(
        "SELECT id_livre AS id, title, picture, created_at FROM Livre ORDER BY created_at DESC LIMIT 5",
      );

    res.json({ games, movies, tvShows, books });
  } catch (err) {
    console.error("/api/home error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/media/:type", (req, res) => {
  const type = req.params.type;
  const idMap = {
    Film: "id_film",
    Serie: "id_serie",
    Livre: "id_livre",
    Jeu_video: "id_jeu",
  };
  const idColumn = idMap[type];

  if (!idColumn) return res.status(400).json({ error: "Type invalide" });

  const sql = `SELECT *, ${idColumn} AS id FROM ${type} ORDER BY created_at DESC LIMIT 5`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/media-details/:type/:id", (req, res) => {
  const { type, id } = req.params;

  const typeMap = {
    jeu: { table: "Jeu_video", idColumn: "id_jeu" },
    film: { table: "Film", idColumn: "id_film" },
    serie: { table: "Serie", idColumn: "id_serie" },
    livre: { table: "Livre", idColumn: "id_livre" },
  };

  const typeInfo = typeMap[type.toLowerCase()];
  if (!typeInfo) return res.status(400).json({ error: "Type invalide" });

  const sql = `SELECT *, ${typeInfo.idColumn} as id FROM ${typeInfo.table} WHERE ${typeInfo.idColumn} = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(404).json({ error: "Introuvable" });
    res.json(result[0]);
  });
});

app.get("/reviews/:type/:id", (req, res) => {
  const { type, id } = req.params;

  const sql = `
        SELECT r.*, u.username
        FROM Reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.media_type = ? AND r.media_id = ?
        ORDER BY r.created_at DESC`;

  db.query(sql, [type, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/reviews", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ msg: "Token invalide" });
  }

  const userId = decoded.id;
  const { mediaType, mediaId, rating, comment } = req.body;

  if (!mediaType || !mediaId || !rating) {
    return res.status(400).json({ msg: "mediaType, mediaId et rating requis" });
  }

  const sql = `INSERT INTO Reviews (user_id, media_type, media_id, rating, comment) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [userId, mediaType, mediaId, rating, comment || ""], (err, result) => {
    if (err) {
      console.error("Erreur insertion review:", err);
      return res.status(500).json({ msg: err.message });
    }

    db.query("SELECT username FROM users WHERE id = ?", [userId], (err2, userResult) => {
      if (err2) {
        return res.status(500).json({ msg: err2.message });
      }

      res.status(201).json({
        id: result.insertId,
        user_id: userId,
        username: userResult[0]?.username || "User",
        media_type: mediaType,
        media_id: mediaId,
        rating,
        comment: comment || "",
        created_at: new Date().toISOString(),
      });
    });
  });
});

app.delete("/reviews/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ msg: "Token invalide" });
  }

  const userId = decoded.id;
  const reviewId = req.params.id;

  db.query("SELECT user_id FROM Reviews WHERE id = ?", [reviewId], (err, result) => {
    if (err) return res.status(500).json({ msg: err.message });
    if (result.length === 0) return res.status(404).json({ msg: "Review non trouvée" });
    if (result[0].user_id !== userId) {
      return res.status(403).json({ msg: "Non autorisé à supprimer cette review" });
    }

    db.query("DELETE FROM Reviews WHERE id = ?", [reviewId], (err2) => {
      if (err2) return res.status(500).json({ msg: err2.message });
      res.json({ success: true, msg: "Review supprimée" });
    });
  });
});

app.get("/reviews/user/:type/:mediaId", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ msg: "Token invalide" });
  }

  const userId = decoded.id;
  const { type, mediaId } = req.params;

  db.query(
    "SELECT * FROM Reviews WHERE user_id = ? AND media_type = ? AND media_id = ?",
    [userId, type, mediaId],
    (err, result) => {
      if (err) return res.status(500).json({ msg: err.message });
      res.json(result[0] || null);
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql =
    "SELECT id, username, email FROM users WHERE email = ? AND password_hash = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0) {
      const user = result[0];
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ success: true, user, token });
    } else {
      res.status(401).json({ message: "Identifiants incorrects" });
    }
  });
});

app.post("/register", (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ msg: "Email, password and username are required" });
  }

  db.query("SELECT id FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ msg: err.message });
    if (result.length > 0) {
      return res.status(409).json({ msg: "An account with this email already exists" });
    }

    db.query(
      "INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)",
      [email, password, username],
      (err2, insertResult) => {
        if (err2) return res.status(500).json({ msg: err2.message });

        const user = { id: insertResult.insertId, email, username };
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ success: true, user, token });
      }
    );
  });
});

app.post("/favorites", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ msg: "Token invalide" });
  }

  const userId = decoded.id;
  const { mediaType, mediaId } = req.body;

  if (!mediaType || !mediaId) {
    return res.status(400).json({ msg: "mediaType and mediaId are required" });
  }

  db.query(
    "SELECT id FROM user_media_list WHERE user_id = ? AND media_type = ? AND media_id = ?",
    [userId, mediaType, mediaId],
    (err, result) => {
      if (err) return res.status(500).json({ msg: err.message });

      if (result.length > 0) {
        db.query("DELETE FROM user_media_list WHERE id = ?", [result[0].id], (err2) => {
          if (err2) return res.status(500).json({ msg: err2.message });
          res.json({ liked: false, msg: "Removed from favorites" });
        });
      } else {
        db.query(
          "INSERT INTO user_media_list (user_id, media_type, media_id, status) VALUES (?, ?, ?, 'liked')",
          [userId, mediaType, mediaId],
          (err2) => {
            if (err2) return res.status(500).json({ msg: err2.message });
            res.status(201).json({ liked: true, msg: "Added to favorites" });
          }
        );
      }
    }
  );
});

app.get("/favorites/check/:type/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ msg: "Token invalide" });
  }

  const userId = decoded.id;
  const { type, id } = req.params;

  db.query(
    "SELECT id FROM user_media_list WHERE user_id = ? AND media_type = ? AND media_id = ?",
    [userId, type, id],
    (err, result) => {
      if (err) return res.status(500).json({ msg: err.message });
      res.json({ liked: result.length > 0 });
    }
  );
});

app.get("/user/:id", (req, res) => {
  const userId = Number(req.params.id);
  if (!userId) return res.status(400).json({ error: "Invalid user id" });

  db.query(
    "SELECT id, username, email, picture, created_at FROM users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0) return res.status(404).json({ error: "User not found" });
      res.json(result[0]);
    }
  );
});

app.get("/user/:id/favorites", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!userId) return res.status(400).json({ error: "Invalid user id" });

    const [rows] = await db.promise().query(
      `
      SELECT 
        uml.media_type,
        uml.media_id,
        COALESCE(f.title, s.title, l.title, j.title) AS title,
        COALESCE(f.picture, s.picture, l.picture, j.picture) AS picture,
        uml.created_at
      FROM user_media_list uml
      LEFT JOIN Film f 
        ON uml.media_type = 'film' AND uml.media_id = f.id_film
      LEFT JOIN Serie s 
        ON uml.media_type = 'serie' AND uml.media_id = s.id_serie
      LEFT JOIN Livre l 
        ON uml.media_type = 'livre' AND uml.media_id = l.id_livre
      LEFT JOIN Jeu_video j
        ON uml.media_type = 'jeu' AND uml.media_id = j.id_jeu
      WHERE uml.user_id = ?
      ORDER BY uml.created_at DESC
      LIMIT 4
      `,
      [userId],
    );

    res.json(
      rows.map((r) => ({
        id: `${r.media_type}-${r.media_id}`,
        mediaType: r.media_type,
        mediaId: r.media_id,
        title: r.title,
        picture: r.picture,
        createdAt: r.created_at,
      })),
    );
  } catch (err) {
    console.error("/user/:id/favorites error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`SERVEUR ACTIF : http://localhost:${PORT}`);
});
