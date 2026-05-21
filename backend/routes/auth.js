const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // validasi password
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password tidak sama" });
    }

    // cek email
    const exist = await User.findOne({ where: { email } });
    if (exist) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // simpan user
    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.json({
      message: "Register berhasil",
      user,
    });

  } catch (err) {

    // error duplicate email dari MySQL
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Email sudah digunakan",
      });
    }

    res.status(500).json({
      error: err.message,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // cek user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        error: "Email tidak ditemukan",
      });
    }

    // cek password
    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid) {
      return res.status(400).json({
        error: "Password salah",
      });
    }

    // BUAT TOKEN JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      "SECRET_KEY",
      {
        expiresIn: "1d",
      }
    );

    // response
    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});

module.exports = router;

