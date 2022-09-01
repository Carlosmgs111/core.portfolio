const { Sequelize } = require("sequelize");
const config = require("../../../config")

module.exports = new Sequelize(
  config.postgresDatabase,
  config.postgresUser,
  config.postgresPassword,
  { host: "localhost", dialect: "postgres" }
);

