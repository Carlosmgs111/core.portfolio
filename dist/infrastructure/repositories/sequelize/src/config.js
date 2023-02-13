"use strict";
const config_env_1 = require("./config.env");
const PROD = true; // ? true for use in production
const USER = !PROD
    ? encodeURIComponent(config_env_1.postgresUserDev || "")
    : encodeURIComponent(config_env_1.postgresUserProd || "");
const PASSWORD = !PROD
    ? encodeURIComponent(config_env_1.postgresPasswordDev || "")
    : encodeURIComponent(config_env_1.postgresPasswordProd || "");
const URI = `postgres://${USER}:${PASSWORD}@${!PROD ? config_env_1.postgresHostDev : config_env_1.postgresHostProd}:${!PROD ? config_env_1.postgresPortDev : config_env_1.postgresPortProd}/${!PROD ? config_env_1.postgresDatabaseDev : config_env_1.postgresDatabaseProd}`;
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
