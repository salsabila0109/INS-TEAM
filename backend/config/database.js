const { Sequelize } = require("sequelize");

const db = new Sequelize("foodies", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;