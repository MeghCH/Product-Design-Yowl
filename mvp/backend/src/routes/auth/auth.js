const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../../prisma/prismaClient");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name, firstname, role } = req.body;

  if (
    !email ||
    !password ||
    !name ||
    !firstname ||
    !["employe", "manager"].includes(role)
  ) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({ msg: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        firstname,
        role,
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

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      firstname: user.firstname,
      role: user.role,
      created_at: user.created_at,
    };

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
