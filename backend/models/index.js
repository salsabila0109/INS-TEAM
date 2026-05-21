const User = require("./User");
const Recipe = require("./Recipe");
const SavedRecipe = require("./SavedRecipe");
const Review = require("./Review");

// =========================
// RELASI USER & RECIPE
// =========================
User.hasMany(Recipe, {
  foreignKey: "userId",
});

Recipe.belongsTo(User, {
  foreignKey: "userId",
});

// =========================
// RELASI SAVED RECIPES
// =========================
User.hasMany(SavedRecipe, {
  foreignKey: "userId",
});

Recipe.hasMany(SavedRecipe, {
  foreignKey: "recipeId",
});

SavedRecipe.belongsTo(User, {
  foreignKey: "userId",
});

SavedRecipe.belongsTo(Recipe, {
  foreignKey: "recipeId",
});

// =========================
// REVIEW
// =========================
User.hasMany(Review, {
  foreignKey: "userId",
});

Recipe.hasMany(Review, {
  foreignKey: "recipeId",
});

Review.belongsTo(User, {
  foreignKey: "userId",
});

Review.belongsTo(Recipe, {
  foreignKey: "recipeId",
});

module.exports = {
  User,
  Recipe,
  SavedRecipe,
  Review,
};