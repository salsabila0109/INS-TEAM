const express = require("express");
const router = express.Router();

const SavedRecipe = require("../models/SavedRecipe");
const Recipe = require("../models/Recipe");
const User = require("../models/User");

// =========================
// SIMPAN RESEP
// =========================
router.post("/", async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    // cek apakah sudah disimpan
    const existing =
      await SavedRecipe.findOne({
        where: {
          userId,
          recipeId,
        },
      });

    // jika sudah -> hapus (toggle)
    if (existing) {
      await existing.destroy();

      return res.json({
        saved: false,
        message:
          "Resep dihapus dari tersimpan",
      });
    }

    // simpan resep
    await SavedRecipe.create({
      userId,
      recipeId,
    });

    res.json({
      saved: true,
      message:
        "Resep berhasil disimpan",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =========================
// CEK APAKAH SUDAH DISIMPAN
// =========================
router.get(
  "/check/:userId/:recipeId",
  async (req, res) => {
    try {
      const saved =
        await SavedRecipe.findOne({
          where: {
            userId:
              req.params.userId,
            recipeId:
              req.params.recipeId,
          },
        });

      res.json({
        saved: !!saved,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// =========================
// AMBIL RESEP TERSIMPAN
// =========================
router.get("/:userId", async (req, res) => {
  try {
    const savedRecipes =
      await SavedRecipe.findAll({
        where: {
          userId:
            req.params.userId,
        },

        include: [
          {
            model: Recipe,
            include: [User],
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],
      });

    const formatted =
      savedRecipes.map(
        (item) => item.Recipe
      );

    res.json(formatted);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =========================
// HAPUS RESEP TERSIMPAN
// =========================
router.delete(
  "/:recipeId/:userId",
  async (req, res) => {
    try {
      const savedRecipe =
        await SavedRecipe.findOne({
          where: {
            recipeId:
              req.params.recipeId,
            userId:
              req.params.userId,
          },
        });

      if (!savedRecipe) {
        return res.status(404).json({
          message:
            "Resep tidak ditemukan",
        });
      }

      await savedRecipe.destroy();

      res.json({
        message:
          "Resep berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

module.exports = router;