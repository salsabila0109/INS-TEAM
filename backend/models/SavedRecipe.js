const { DataTypes } = require("sequelize");
const db = require("../config/database");

const SavedRecipe = db.define(
  "SavedRecipe",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "saved_recipes",
    timestamps: true,
  }
);

module.exports = SavedRecipe;