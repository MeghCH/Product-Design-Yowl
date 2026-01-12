const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const prisma = require("../../../prisma/prismaClient");

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
}

router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.commentaire.findMany({
      where: { post_id: Number(postId) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: "asc" },
    });

    res.json(comments);
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await prisma.commentaire.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
          },
        },
      },
    });

    if (!comment) return res.status(404).json({ msg: "Not found" });

    res.json(comment);
  } catch (err) {
    return serverError(res, err);
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { post_id, content } = req.body;

  if (!post_id || !content) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const comment = await prisma.commentaire.create({
      data: {
        post_id: Number(post_id),
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

    res.status(201).json(comment);
  } catch (err) {
    return serverError(res, err);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const existing = await prisma.commentaire.findFirst({
      where: {
        id: Number(id),
        user_id: Number(req.user.id),
      },
    });

    if (!existing) return res.status(404).json({ msg: "Not found" });

    const updated = await prisma.commentaire.update({
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
    const result = await prisma.commentaire.deleteMany({
      where: {
        id: Number(id),
        user_id: Number(req.user.id),
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json({ msg: `Successfully deleted comment ${id}` });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
