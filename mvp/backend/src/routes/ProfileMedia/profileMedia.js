import express from "express";

const router = express.Router();

/**
 * GET /api/profile/media/:mediaType?status=seen|to_see
 * mediaType: games|movies|tv_shows|books
 * Retour: [{ id, title, picture, description }]
 */
router.get("/api/profile/media/:mediaType", async (req, res) => {
  try {
    // ⚠️ à adapter: ici je suppose que tu as req.user.id (session/JWT)
    // Si tu n'as pas encore d'auth, utilise un user_id fixe pour tester:
    const userId = req.user?.id || 1;

    const { mediaType } = req.params;
    const status = req.query.status || "seen";

    const map = {
      games: { table: "Jeu_video", idCol: "id_jeu", type: "jeu" },
      movies: { table: "Film", idCol: "id_film", type: "film" },
      tv_shows: { table: "Serie", idCol: "id_serie", type: "serie" },
      books: { table: "Livre", idCol: "id_livre", type: "livre" },
    };

    const conf = map[mediaType];
    if (!conf) return res.status(400).json({ error: "Invalid mediaType" });

    if (!["seen", "to_see"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // IMPORTANT: ici on JOIN la liste user_media_list avec la table média
    // On évite l'injection SQL en ne mettant que des valeurs contrôlées (map ci-dessus)
    const sql = `
      SELECT 
        m.${conf.idCol} AS id,
        m.title,
        m.description,
        m.picture
      FROM user_media_list uml
      JOIN ${conf.table} m
        ON uml.media_id = m.${conf.idCol}
      WHERE uml.user_id = ?
        AND uml.media_type = ?
        AND uml.status = ?
      ORDER BY uml.created_at DESC
    `;

    const [rows] = await req.db.query(sql, [userId, conf.type, status]);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
