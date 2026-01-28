const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

app.use(express.json());

// --- CONNEXION MYSQL ---
const db = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "vscode",     
    password: "root",
    database: "yowl_db"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Erreur MySQL :", err.message);
    } else {
        console.log("✅ connecté à la DB");
}});

// --- ROUTES ---

// 1. Route Media (Pour la HomePage)
app.get("/media/:type", (req, res) => {
    const type = req.params.type;
    const idMap = { "Film": "id_film", "Serie": "id_serie", "Livre": "id_livre", "Jeu_video": "id_jeu" };
    const idColumn = idMap[type];

    if (!idColumn) return res.status(400).json({ error: "Type invalide" });

    // On ajoute 'AS id' pour que React trouve item.id sans effort
    const sql = `SELECT *, ${idColumn} AS id FROM ${type} ORDER BY created_at DESC LIMIT 5`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// 2. Route Media Details (Pour la ReviewPage)
app.get("/media-details/:type/:id", (req, res) => {
    const { type, id } = req.params;
    const idMap = { "Film": "id_film", "Serie": "id_serie", "Livre": "id_livre", "Jeu_video": "id_jeu" };
    const idColumn = idMap[type];
    
    if (!idColumn) return res.status(400).json({ error: "Type invalide" });
    
    const sql = `SELECT *, ${idColumn} as id FROM ${type} WHERE ${idColumn} = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ error: "Introuvable" });
        res.json(result[0]);
    });
});

// 3. Route des Avis (Pour la ReviewPage - Reviews Section)
app.get("/reviews/:type/:id", (req, res) => {
    const { type, id } = req.params;
    
    // Jointure pour récupérer le nom de l'utilisateur qui a écrit l'avis
    const sql = `
        SELECT r.*, u.username 
        FROM reviews r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.media_type = ? AND r.media_id = ? 
        ORDER BY r.created_at DESC`;

    db.query(sql, [type, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// 4. Route Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT id, username, email FROM users WHERE email = ? AND password_hash = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            res.status(401).json({ message: "Identifiants incorrects" });
        }
    });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 SERVEUR ACTIF : http://localhost:${PORT}`);
});