const express = require("express");
const bcrypt = require("bcryptjs");
const { authenticateToken } = require("../../middleware/auth");
const prisma = require("../../../prisma/prismaClient");

const router = express.Router();

router.get("/:identifier", authenticateToken, async (req, res) => {
  const { identifier } = req.params;

  try {
    let where = {};
    if (!isNaN(identifier)) {
      where = { id: Number(identifier) };
    } else {
      where = { email: identifier };
    }

    const user = await prisma.user.findUnique({
      where,
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

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { email, password, firstname, name, currentPassword } = req.body;

  if (Number(id) !== req.user.id) {
    return res.status(403).json({ msg: "Not found" });
  }

  if (email == null || firstname == null || name == null) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    if (!currentPassword || !currentPassword.trim()) {
      return res.status(400).json({ msg: "Mot de passe actuel obligatoire" });
    }

    const existing = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { password: true },
    });
    if (!existing) return res.status(404).json({ msg: "Not found" });

    const isValid = await bcrypt.compare(currentPassword, existing.password);
    if (!isValid) {
      return res.status(401).json({ msg: "Mot de passe actuel incorrect" });
    }

    let hashed = existing.password;
    if (typeof password === "string" && password.trim() !== "") {
      hashed = await bcrypt.hash(password.trim(), 10);
    }

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        email,
        password: hashed,
        name,
        firstname,
      },
      select: {
        id: true,
        email: true,
        name: true,
        firstname: true,
        role: true,
        created_at: true,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (Number(id) !== Number(req.user?.id)) {
    return res.status(403).json({ msg: "Forbidden" });
  }

  try {
    await prisma.todo.deleteMany({ where: { user_id: Number(id) } });
    await prisma.user.delete({ where: { id: Number(id) } });

    res.json({ msg: `Successfully deleted record number: ${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
