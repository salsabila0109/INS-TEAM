const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const router = express.Router();


// ================= REGISTER =================
router.post(
  "/register",
  [
    body("name")
      .notEmpty()
      .withMessage("Nama wajib diisi"),

    body("email")
      .isEmail()
      .withMessage("Format email tidak valid"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),

    body("confirmPassword")
      .notEmpty()
      .withMessage("Konfirmasi password wajib diisi"),
  ],
  async (req, res) => {
    try {
      // cek validasi input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const {
        name,
        email,
        password,
        confirmPassword,
      } = req.body;

      // validasi password
      if (password !== confirmPassword) {
        return res.status(400).json({
          error: "Password tidak sama",
        });
      }

      // cek email
      const exist = await User.findOne({
        where: { email },
      });

      if (exist) {
        return res.status(400).json({
          error: "Email sudah terdaftar",
        });
      }

      // hash password
      const hashed = await bcrypt.hash(
        password,
        10
      );

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

      if (
        err.name ===
        "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          error: "Email sudah digunakan",
        });
      }

      res.status(500).json({
        error: err.message,
      });
    }
  }
);


// ================= LOGIN =================
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Format email tidak valid"),

    body("password")
      .notEmpty()
      .withMessage("Password wajib diisi"),
  ],
  async (req, res) => {
    try {
      // cek validasi input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

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

      // buat token JWT
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
  }
);

module.exports = router;