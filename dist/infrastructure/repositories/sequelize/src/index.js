"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_env_1 = require("./config.env");
let ENV = null;
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
    logging: false, //console.log
});
((ENV) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ ENV });
    if (ENV === "DEV")
        return;
    if (ENV === "PROD")
        return;
    yield exports.sequelize.sync({ alter: true });
}))(ENV);
