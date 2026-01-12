const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const prisma = require("../../../prisma/prismaClient");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        firstname: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) return res.status(404).json({ msg: "Not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/todos", authenticateToken, async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { user_id: req.user.id },
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        due_time: true,
        status: true,
        user_id: true,
      },
      orderBy: { id: "desc" },
    });

    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
