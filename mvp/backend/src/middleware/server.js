const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
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

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql =
    "SELECT id, username, email FROM users WHERE email = ? AND password_hash = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0) {
      res.json({ success: true, user: result[0] });
    } else {
      res.status(401).json({ message: "Identifiants incorrects" });
    }
  });
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
