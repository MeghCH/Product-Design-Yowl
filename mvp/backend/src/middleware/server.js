const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Configuration CORS pour ton frontend (Vite)
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

app.use(express.json());

// CONNEXION MYSQL (Port 3306)
const db = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "vscode",
    password: "root", // <--- Ton mot de passe MySQL ici
    database: "yowl_db"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Erreur MySQL (3306):", err.message);
    } else {
        console.log("✅ Backend connecté à MySQL sur le port 3306");
    }
});

// --- ROUTES ---

// Route Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log(`📩 Tentative de connexion : ${email}`);

    const sql = "SELECT id, username, email FROM users WHERE email = ? AND password_hash = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.length > 0) {
            console.log("✅ Succès pour :", result[0].username);
            res.json({ success: true, user: result[0] });
        } else {
            console.log("❌ Échec : Identifiants incorrects");
            res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }
    });
});

// Route Profil (utilisée par ProfilePage.jsx)
app.get("/user/:id", (req, res) => {
    const sql = "SELECT id, username, email, created_at FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: "Non trouvé" });
        res.json(result[0]);
    });
});

// Route Media (utilisée par HomePage.jsx)
app.get("/media/:type", (req, res) => {
    const table = req.params.type; // Film, Serie, Livre, etc.
    const sql = `SELECT * FROM ${table}`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log("-----------------------------------------");
    console.log(`🚀 SERVEUR ACTIF : http://localhost:${PORT}`);
    console.log("-----------------------------------------");
});