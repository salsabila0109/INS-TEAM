const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Recipe = db.define("Recipe", {

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  serving: {
    type: DataTypes.STRING,
  },

  description: {
    type: DataTypes.TEXT,
  },

  category: {
    type: DataTypes.STRING,
  },

  image: {
    type: DataTypes.TEXT,
  },

  ingredients: {
    type: DataTypes.TEXT,
  },

  steps: {
    type: DataTypes.TEXT,
  },

  rating: {
    type: DataTypes.DECIMAL(2,1),
    allowNull: true,
    defaultValue: null,
  },

  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

}, {
  tableName: "recipes",
  timestamps: true,
});

module.exports = Recipe;