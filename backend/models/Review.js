const { DataTypes } =
  require("sequelize");

const db =
  require("../config/database");

const Review = db.define(
  "Review",
  {
    rating: {
      type:
        DataTypes.INTEGER,
      allowNull: false,
    },

    comment: {
      type:
        DataTypes.TEXT,
      allowNull: true,
    },

    recipeId: {
      type:
        DataTypes.INTEGER,
      allowNull: false,
    },

    userId: {
      type:
        DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName:
      "reviews",
    timestamps: true,
  }
);

module.exports = Review;