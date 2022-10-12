"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_env_1 = require("./config.env");
let ENV = "TEST";
if (process.argv.includes("DEV"))
    ENV = "DEV";
if (process.argv.includes("PROD"))
    ENV = "PROD";
let database = (() => {
    if (ENV === "DEV")
        return config_env_1.postgresDatabaseDev;
    if (ENV === "PROD")
        return config_env_1.postgresDatabaseProd;
    return "test";
})();
let user = (() => {
    if (ENV === "DEV")
        return config_env_1.postgresUserDev;
    if (ENV === "PROD")
        return config_env_1.postgresUserProd;
    return "tester";
})();
let PASSWORD = (() => {
    if (ENV === "DEV")
        return encodeURIComponent(config_env_1.postgresPasswordDev);
    if (ENV === "PROD")
        return encodeURIComponent(config_env_1.postgresPasswordProd);
    return encodeURIComponent("password");
})();
let host = (() => {
    if (ENV === "DEV")
        return config_env_1.postgresHostDev;
    if (ENV === "PROD")
        return config_env_1.postgresHostProd;
    return "127.0.0.1";
})();
let port = (() => {
    if (ENV === "DEV")
        return Number(config_env_1.postgresPortDev);
    if (ENV === "PROD")
        return Number(config_env_1.postgresPortProd);
    return Number(5432);
})();
exports.sequelize = new sequelize_1.Sequelize(database, user, PASSWORD, {
    host,
    port,
    dialect: "postgres",
    logging: false //console.log
});
console.log({ ENV });
