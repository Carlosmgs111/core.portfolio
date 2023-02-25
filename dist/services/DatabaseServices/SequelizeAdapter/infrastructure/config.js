"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const config_1 = __importDefault(require("../../../../config"));
const { postgresUserDev, postgresPasswordDev, postgresHostDev, postgresPortDev, postgresDatabaseDev, postgresUserProd, postgresPasswordProd, postgresHostProd, postgresPortProd, postgresDatabaseProd, postgresUserTest, postgresPasswordTest, postgresHostTest, postgresPortTest, postgresDatabaseTest, } = config_1.default;
const test = !false;
const PROD = !true; // ? true for use in production
const USER = !PROD
    ? encodeURIComponent(postgresUserDev || "")
    : encodeURIComponent(postgresUserProd || "");
const PASSWORD = !PROD
    ? encodeURIComponent(postgresPasswordDev || "")
    : encodeURIComponent(postgresPasswordProd || "");
const URI = `postgres://${USER}:${PASSWORD}@${!PROD ? postgresHostDev : postgresHostProd}:${!PROD ? postgresPortDev : postgresPortProd}/${!test
    ? !PROD
        ? postgresDatabaseDev
        : postgresDatabaseProd
    : postgresDatabaseTest}`;
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
