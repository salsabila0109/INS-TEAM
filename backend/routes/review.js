const express =
  require("express");

const router =
  express.Router();

const Review =
  require("../models/Review");

const User =
  require("../models/User");

const Recipe =
  require("../models/Recipe");

// =========================
// GET REVIEW RESEP
// =========================
router.get(
  "/:recipeId",
  async (req, res) => {
    try {
      const reviews =
        await Review.findAll({
          where: {
            recipeId:
              req.params.recipeId,
          },

            include: {
            model: User,
            attributes: ["id", "name", "photo"]
            },     
                 
          order: [
            [
              "createdAt",
              "DESC",
            ],
          ],
        });

      res.json(reviews);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// =========================
// TAMBAH REVIEW
// =========================
router.post(
  "/",
  async (req, res) => {
    try {
      const {
        userId,
        recipeId,
        rating,
        comment,
      } = req.body;

      // user sudah review?
      const existing =
        await Review.findOne({
          where: {
            userId,
            recipeId,
          },
        });

      if (existing) {
        return res
          .status(400)
          .json({
            message:
              "Anda sudah memberi review",
          });
      }

      await Review.create({
        userId,
        recipeId,
        rating,
        comment,
      });

      // update rata-rata rating
      const reviews =
        await Review.findAll({
          where: {
            recipeId,
          },
        });

      const total =
        reviews.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.rating,
          0
        );

      const avg =
        total /
        reviews.length;

      await Recipe.update(
        {
          rating:
            avg.toFixed(
              1
            ),

          totalReviews:
            reviews.length,
        },
        {
          where: {
            id: recipeId,
          },
        }
      );

      res.json({
        message:
          "Review berhasil ditambahkan",
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