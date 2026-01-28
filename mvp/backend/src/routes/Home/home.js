// GET /api/home
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
