const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const authRoutes = require("./routes/auth/auth.js");
const userRoutes = require("./routes/user/user.js");
const postsRoutes = require("./routes/posts/posts.js");
const commentsRoutes = require("./routes/comments/comments.js");
const playlistsRoutes = require("./routes/playlists/playlists.js");
const reviewsRoutes = require("./routes/reviews/reviews.js");
const notFound = require("./middleware/notFound.js");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://frontend:5173",
    ],
    credentials: true,
  }),
);

app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  user: process.env.DB_USER || "vscode",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_NAME || "yowl_db",
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

app.use(authRoutes);

app.use("/user", userRoutes);

app.use("/posts", postsRoutes);

app.use("/comments", commentsRoutes);

app.use("/playlists", playlistsRoutes);

app.use("/reviews", reviewsRoutes);

app.use(notFound);

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
