"use strict";
const config_env_1 = require("./config.env");
const USER = encodeURIComponent(/* postgresUserDev || */ config_env_1.postgresUserProd);
const PASSWORD = encodeURIComponent(/* postgresPasswordDev || */ config_env_1.postgresPasswordProd);
const URI = `postgres://${USER}:${PASSWORD}@${ /* postgresHostDev || */config_env_1.postgresHostProd}:${ /* postgresPortDev ||  */config_env_1.postgresPortProd}/${ /* postgresDatabaseDev ||  */config_env_1.postgresDatabaseProd}`;
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
