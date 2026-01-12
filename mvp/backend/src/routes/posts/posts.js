const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const prisma = require("../../../prisma/prismaClient");

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
}

router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(posts);
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!post) return res.status(404).json({ msg: "Not found" });

    res.json(post);
  } catch (err) {
    return serverError(res, err);
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const post = await prisma.post.create({
      data: {
        content,
        user_id: Number(req.user.id),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(post);
  } catch (err) {
    return serverError(res, err);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const existing = await prisma.post.findFirst({
      where: {
        id: Number(id),
        user_id: Number(req.user.id),
      },
    });

    if (!existing) return res.status(404).json({ msg: "Not found" });

    const updated = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        content: content ?? existing.content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
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
    const result = await prisma.post.deleteMany({
      where: {
        id: Number(id),
        user_id: Number(req.user.id),
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json({ msg: `Successfully deleted post ${id}` });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
