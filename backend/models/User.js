const { DataTypes } = require("sequelize");
const db = require("../config/database");

const User = db.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  photo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

}, {
  tableName: "users",
  timestamps: true,
});

module.exports = User;