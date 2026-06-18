const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const User = require("../models/User");
const Recipe = require("../models/Recipe");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const verifyToken = require(
  "../middlewares/verifyToken"
);

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "foodieshub/profiles",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// GET PROFILE
router.get("/:id", async (req, res) => {
  try {

    const user = await User.findByPk(req.params.id, {
      attributes: [
        "id",
        "name",
        "email",
        "bio",
        "photo",
        "createdAt"
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // hitung jumlah resep user
    const totalRecipes = await Recipe.count({
      where: {
        userId: req.params.id
      }
    });

    res.json({
      ...user.toJSON(),
      totalRecipes,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

// UPDATE PROFILE
router.put("/:id", verifyToken, upload.single("photo"), async (req, res) => {
  try {

    const { name, bio } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    let photo = user.photo;

    if (req.file) {
      photo = req.file.path;
    }

    await user.update({
      name,
      bio,
      photo,
    });

    const freshUser = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "bio", "photo", "createdAt"]
    });

    res.json({
      message: "Profil berhasil diupdate",
      user: freshUser,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

// CHANGE PASSWORD
router.put(
  "/change-password/:id",
  verifyToken,
  async (req, res) => {
    try {
      const {
        oldPassword,
        newPassword,
      } = req.body;

      const user =
        await User.findByPk(
          req.params.id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User tidak ditemukan",
          });
      }

      // cek password lama
      const isMatch =
        await bcrypt.compare(
          oldPassword,
          user.password
        );

      if (!isMatch) {
        return res
          .status(400)
          .json({
            message:
              "Password lama salah",
          });
      }

      // hash password baru
      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      // update password
      await user.update({
        password:
          hashedPassword,
      });

      res.json({
        message:
          "Password berhasil diperbarui",
      });
    } catch (error) {
      console.error(
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

module.exports = router;