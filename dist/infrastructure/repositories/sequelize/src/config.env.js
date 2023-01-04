"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresPortProd = exports.postgresHostProd = exports.postgresPasswordProd = exports.postgresUserProd = exports.postgresDatabaseProd = exports.postgresPortTest = exports.postgresHostTest = exports.postgresPasswordTest = exports.postgresUserTest = exports.postgresDatabaseTest = exports.postgresPortDev = exports.postgresHostDev = exports.postgresPasswordDev = exports.postgresUserDev = exports.postgresDatabaseDev = exports.postgresPort = exports.postgresHost = exports.postgresPassword = exports.postgresUser = exports.postgresDatabase = void 0;
require("dotenv").config();
exports.postgresDatabase = process.env.POSTGRES_DATABASE;
exports.postgresUser = process.env.POSTGRES_USER;
exports.postgresPassword = process.env.POSTGRES_PASSWORD;
exports.postgresHost = process.env.POSTGRES_HOST;
exports.postgresPort = process.env.POSTGRES_PORT;
/*  */
exports.postgresDatabaseDev = process.env.POSTGRES_DATABASE_DEV;
exports.postgresUserDev = process.env.POSTGRES_USER_DEV;
exports.postgresPasswordDev = process.env.POSTGRES_PASSWORD_DEV;
exports.postgresHostDev = process.env.POSTGRES_HOST_DEV;
exports.postgresPortDev = process.env.POSTGRES_PORT_DEV;
/*  */
exports.postgresDatabaseTest = process.env.POSTGRES_DATABASE_TEST;
exports.postgresUserTest = process.env.POSTGRES_USER_TEST;
exports.postgresPasswordTest = process.env.POSTGRES_PASSWORD_TEST;
exports.postgresHostTest = process.env.POSTGRES_HOST_TEST;
exports.postgresPortTest = process.env.POSTGRES_PORT_TEST;
/*  */
exports.postgresDatabaseProd = process.env.POSTGRES_DATABASE_PROD;
exports.postgresUserProd = process.env.POSTGRES_USER_PROD;
exports.postgresPasswordProd = process.env.POSTGRES_PASSWORD_PROD;
exports.postgresHostProd = process.env.POSTGRES_HOST_PROD;
exports.postgresPortProd = process.env.POSTGRES_PORT_PROD;
