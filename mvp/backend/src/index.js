const express = require("express");
const cors = require("cors");
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
    origin: ["http://localhost:5173", "http://frontend:5173"],
    credentials: true,
  })
);

app.use(express.json());

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