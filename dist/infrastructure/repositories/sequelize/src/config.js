"use strict";
const config_env_1 = require("./config.env");
const USER = encodeURIComponent(config_env_1.postgresUserDev || config_env_1.postgresUserProd);
const PASSWORD = encodeURIComponent(config_env_1.postgresPasswordDev || config_env_1.postgresPasswordProd);
const URI = `postgres://${USER}:${PASSWORD}@${config_env_1.postgresHostDev || config_env_1.postgresHostProd}:${config_env_1.postgresPortDev || config_env_1.postgresPortProd}/${config_env_1.postgresDatabaseDev || config_env_1.postgresDatabaseProd}`;
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
