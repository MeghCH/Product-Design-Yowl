const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const prisma = require("../../../prisma/prismaClient");

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
}

router.get("/", authenticateToken, async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { user_id: Number(req.user.id) },
      select: {
        id: true,
        name: true,
        created_at: true,
        user_id: true,
      },
      orderBy: { created_at: "desc" },
    });

    res.json(playlists);
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const playlist = await prisma.playlist.findFirst({
      where: {
        id: Number(id),
        user_id: Number(req.user.id),
      },
      select: {
        id: true,
        name: true,
        created_at: true,
        user_id: true,
      },
    });

    if (!playlist) return res.status(404).json({ msg: "Not found" });

    res.json(playlist);
  } catch (err) {
    return serverError(res, err);
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const playlist = await prisma.playlist.create({
      data: {
        name,
        user_id: Number(req.user.id),
      },
      select: {
        id: true,
        name: true,
        created_at: true,
        user_id: true,
      },
    });

    res.status(201).json(playlist);
  } catch (err) {
    return serverError(res, err);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const existing = await prisma.playlist.findFirst({
      where: {
        id: Number(id),
        user_id: Number(req.user.id),
      },
    });

    if (!existing) return res.status(404).json({ msg: "Not found" });

    const updated = await prisma.playlist.update({
      where: { id: Number(id) },
      data: {
        name: name ?? existing.name,
      },
      select: {
        id: true,
        name: true,
        created_at: true,
        user_id: true,
      },
    });

    res.json(updated);
  } catch (err) {
    return serverError(res, err);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await prisma.playlist.deleteMany({
      where: {
        id: Number(id),
        user_id: Number(req.user.id),
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json({ msg: `Successfully deleted playlist ${id}` });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
