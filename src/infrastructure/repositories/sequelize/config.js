const config = require("../../../config/index");

const USER = encodeURIComponent(config.postgresUser);
const PASSWORD = encodeURIComponent(config.postgresPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.postgresHost}:${config.postgresPort}/${config.postgresDatabase}`;

module.exports = {
  development: {
    url: URI,
    dialect: "postgres",
  },
  production: {
    url: URI,
    dialect: "postgres",
  },
};
