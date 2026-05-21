const express = require("express");
const router = express.Router();

const Recipe = require("../models/Recipe");
const User = require("../models/User");

const multer = require("multer");
const path = require("path");

const verifyToken = require(
  "../middlewares/verifyToken"
);

// RELATION
User.hasMany(Recipe, {
  foreignKey: "userId",
});

Recipe.belongsTo(User, {
  foreignKey: "userId",
});

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );

  },

});

const upload = multer({
  storage,
});

// =========================
// CREATE RECIPE
// =========================
router.post(
  "/",
  verifyToken,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "stepImages",
      maxCount: 50,
    },
  ]),
  async (req, res) => {
    try {

      const {
        title,
        serving,
        description,
        category,
        ingredients,
        steps,
        userId,
      } = req.body;

      const parsedSteps =
        steps
          ? JSON.parse(steps)
          : [];

      const uploadedStepImages =
        req.files?.stepImages || [];

      let imageIndex = 0;

      parsedSteps.forEach((step) => {

      step.images =
        (step.images || []).map(() => {

          const file =
            uploadedStepImages[imageIndex];

          imageIndex++;

          return file
            ? file.filename
            : "";

        });

      });

      const recipe = await Recipe.create({

        title,
        serving,
        description,
        category,

        // simpan nama file
        image:
          req.files?.image?.[0]
            ?.filename || "",

        ingredients,

        steps: JSON.stringify(parsedSteps),

        userId,

      });

      res.json({
        message: "Resep berhasil dibuat",
        recipe,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

// =========================
// GET ALL RECIPES
// =========================
router.get("/", async (req, res) => {

  try {

    const recipes = await Recipe.findAll({

      include: [
        {
          model: User,
          attributes: [
            "id",
            "name",
            "photo",
          ],
        },
      ],

      order: [
        ["createdAt", "DESC"]
      ],

    });

    res.json(recipes);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

});

// =========================
// GET DETAIL RECIPE BY ID
// =========================
router.get("/:id", async (req, res) => {
  try {

    const recipe = await Recipe.findOne({

      where: {
        id: req.params.id,
      },

      include: [
        {
          model: User,
          attributes: [
            "id",
            "name",
            "photo",
          ],
        },
      ],

    });

    if (!recipe) {
      return res.status(404).json({
        message: "Resep tidak ditemukan",
      });
    }

    // ubah ke object biasa
    const recipeData = recipe.toJSON();

    // parse ingredients
    recipeData.ingredients =
      recipeData.ingredients
        ? JSON.parse(recipeData.ingredients)
        : [];

    // parse steps
    recipeData.steps =
      recipeData.steps
        ? JSON.parse(recipeData.steps)
        : [];

    res.json(recipeData);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
});

// =========================
// GET RECIPES BY USER
// =========================
router.get("/user/:id", async (req, res) => {

  try {

    const recipes = await Recipe.findAll({

      where: {
        userId: req.params.id,
      },

      order: [
        ["createdAt", "DESC"]
      ],

    });

    res.json(recipes);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

});

module.exports = router;