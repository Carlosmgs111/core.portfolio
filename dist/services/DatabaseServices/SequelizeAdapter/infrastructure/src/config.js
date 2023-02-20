"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const config_1 = __importDefault(require("../../../../../config"));
const { postgresUserDev, postgresPasswordDev, postgresHostDev, postgresPortDev, postgresDatabaseDev, postgresUserProd, postgresPasswordProd, postgresHostProd, postgresPortProd, postgresDatabaseProd, } = config_1.default;
const PROD = !true; // ? true for use in production
const USER = !PROD
    ? encodeURIComponent(postgresUserDev || "")
    : encodeURIComponent(postgresUserProd || "");
const PASSWORD = !PROD
    ? encodeURIComponent(postgresPasswordDev || "")
    : encodeURIComponent(postgresPasswordProd || "");
const URI = `postgres://${USER}:${PASSWORD}@${!PROD ? postgresHostDev : postgresHostProd}:${!PROD ? postgresPortDev : postgresPortProd}/${!PROD ? postgresDatabaseDev : postgresDatabaseProd}`;
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
