const express = require("express");
const router = express.Router();

const Recipe = require("../models/Recipe");
const User = require("../models/User");
const Review = require("../models/Review");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

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

Recipe.hasMany(Review, {
  foreignKey: "recipeId",
});

Review.belongsTo(Recipe, {
  foreignKey: "recipeId",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "foodieshub",
    allowed_formats: ["jpg", "png", "jpeg"],
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
console.log("STEP:", step);
console.log("STEP IMAGES:", step.images);
      step.images =
        (step.images || []).map(() => {

          const file =
            uploadedStepImages[imageIndex];

          imageIndex++;

          return file ? file.path : "";

        });

      });
console.log("BODY:", req.body);
console.log("FILES:", req.files);
      const recipe = await Recipe.create({

        title,
        serving,
        description,
        category,

        // simpan nama file
        image: req.files?.image?.[0]?.path || "",

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
    });

// =========================
// GET ALL RECIPES
// =========================
router.get("/", async (req, res) => {

  try {

    const recipes =
      await Recipe.findAll({

        include: [
          {
            model: User,
            attributes: [
              "id",
              "name",
              "photo",
            ],
          },
          {
            model: Review,
            attributes: [
              "rating"
            ],
          },
        ],

        order: [
          ["createdAt", "DESC"]
        ],

      });

    // HITUNG RATING & REVIEW
    const recipesWithStats =
      recipes.map(
        (recipe) => {

          const data =
            recipe.toJSON();

          const reviews =
            data.Reviews || [];

          const totalReviews =
            reviews.length;

          const averageRating =
            totalReviews > 0
              ? reviews.reduce(
                  (
                    sum,
                    review
                  ) =>
                    sum +
                    review.rating,
                  0
                ) /
                totalReviews
              : 0;

          return {
            ...data,
            totalReviews,
            averageRating:
              Number(
                averageRating.toFixed(
                  1
                )
              ),
          };
        }
      );

    res.json(
      recipesWithStats
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
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
      where: { userId: req.params.id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "photo"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(recipes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// =========================
// UPDATE RECIPE
// =========================
router.put(
  "/:id",
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

      const recipe =
        await Recipe.findByPk(
          req.params.id
        );

      if (!recipe) {
        return res
          .status(404)
          .json({
            message:
              "Resep tidak ditemukan",
          });
      }

      const {
        title,
        serving,
        description,
        category,
        ingredients,
        steps,
      } = req.body;

      // parse step lama
      const oldSteps =
        recipe.steps
          ? JSON.parse(
              recipe.steps
            )
          : [];

      // parse step baru
      const parsedSteps =
        steps
          ? JSON.parse(
              steps
            )
          : [];

      const uploadedStepImages =
        req.files
          ?.stepImages ||
        [];

      let imageIndex = 0;

      parsedSteps.forEach(
        (
          step,
          stepIndex
        ) => {

          step.images =
            (
              step.images ||
              []
            ).map(
              (img) => {

                // gambar lama
                if (
                  typeof img ===
                    "string" &&
                  img &&
                  !img.startsWith(
                    "step-"
                  )
                ) {
                  return img;
                }

                // gambar baru
                const file =
                  uploadedStepImages[
                    imageIndex
                  ];

                imageIndex++;

                return file ? file.path : "";
              }
            );
        }
      );

      // foto utama
      let mainImage =
        recipe.image;

      if (
        req.files?.image?.[0]
      ) {
        mainImage = req.files.image[0].path;
      }

      await recipe.update({
        title,
        serving,
        description,
        category,
        image:
          mainImage,
        ingredients,
        steps:
          JSON.stringify(
            parsedSteps
          ),
      });

      res.json({
        message:
          "Resep berhasil diperbarui",
        recipe,
      });

    } catch (error) {

      console.log(
        error
      );

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);

// =========================
// DELETE RECIPE
// =========================
router.delete(
  "/:id",
  verifyToken,
  async (req, res) => {
    try {
      const recipe =
        await Recipe.findByPk(
          req.params.id
        );

      if (!recipe) {
        return res
          .status(404)
          .json({
            message:
              "Resep tidak ditemukan",
          });
      }

      // keamanan:
      // hanya pemilik resep
      // yang boleh hapus
      if (
        recipe.userId !==
        req.user.id
      ) {
        return res
          .status(403)
          .json({
            message:
              "Tidak punya akses",
          });
      }

      await recipe.destroy();

      res.json({
        message:
          "Resep berhasil dihapus",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);
module.exports = router;