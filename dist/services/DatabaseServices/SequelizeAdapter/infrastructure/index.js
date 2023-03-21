"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../../../../config"));
const { postgresUserProd, postgresPasswordProd, postgresHostProd, postgresPortProd, postgresDatabaseProd, postgresDatabaseDev, postgresUserDev, postgresPasswordDev, postgresHostDev, postgresPortDev, postgresDatabaseTest, postgresUserTest, postgresPasswordTest, postgresHostTest, postgresPortTest, } = config_1.default;
let ENV = null;
if (process.argv.includes("DEV"))
    ENV = "DEV";
if (process.argv.includes("PROD"))
    ENV = "PROD";
let database = (() => {
    if (ENV === "DEV")
        return postgresDatabaseDev;
    if (ENV === "PROD")
        return postgresDatabaseProd;
    return postgresDatabaseTest;
})();
let user = (() => {
    if (ENV === "DEV")
        return postgresUserDev;
    if (ENV === "PROD")
        return postgresUserProd;
    return postgresUserTest;
})();
let PASSWORD = (() => {
    if (ENV === "DEV")
        return encodeURIComponent(postgresPasswordDev);
    if (ENV === "PROD")
        return encodeURIComponent(postgresPasswordProd);
    return encodeURIComponent(postgresPasswordTest);
})();
let host = (() => {
    if (ENV === "DEV")
        return postgresHostDev;
    if (ENV === "PROD")
        return postgresHostProd;
    return postgresHostTest;
})();
let port = (() => {
    if (ENV === "DEV")
        return Number(postgresPortDev);
    if (ENV === "PROD")
        return Number(postgresPortProd);
    return Number(postgresPortTest);
})();
exports.sequelize = new sequelize_1.Sequelize(database, user, PASSWORD, {
    host,
    port,
    dialect: "postgres",
    logging: false, //
});
