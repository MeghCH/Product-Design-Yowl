const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ msg: "Access token required" });
  }

  const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid token" });
    }

    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
