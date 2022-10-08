"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresPortProd = exports.postgresHostProd = exports.postgresPasswordProd = exports.postgresUserProd = exports.postgresDatabaseProd = exports.postgresPortTest = exports.postgresHostTest = exports.postgresPasswordTest = exports.postgresUserTest = exports.postgresDatabaseTest = exports.postgresPortDev = exports.postgresHostDev = exports.postgresPasswordDev = exports.postgresUserDev = exports.postgresDatabaseDev = exports.postgresPort = exports.postgresHost = exports.postgresPassword = exports.postgresUser = exports.postgresDatabase = void 0;
require("dotenv").config();
exports.postgresDatabase = String(process.env.POSTGRES_DATABASE);
exports.postgresUser = String(process.env.POSTGRES_USER);
exports.postgresPassword = String(process.env.POSTGRES_PASSWORD);
exports.postgresHost = String(process.env.POSTGRES_HOST);
exports.postgresPort = String(process.env.POSTGRES_PORT);
/*  */
exports.postgresDatabaseDev = String(process.env.POSTGRES_DATABASE_DEV);
exports.postgresUserDev = String(process.env.POSTGRES_USER_DEV);
exports.postgresPasswordDev = String(process.env.POSTGRES_PASSWORD_DEV);
exports.postgresHostDev = String(process.env.POSTGRES_HOST_DEV);
exports.postgresPortDev = String(process.env.POSTGRES_PORT_DEV);
/*  */
exports.postgresDatabaseTest = String(process.env.POSTGRES_DATABASE_TEST);
exports.postgresUserTest = String(process.env.POSTGRES_USER_TEST);
exports.postgresPasswordTest = String(process.env.POSTGRES_PASSWORD_TEST);
exports.postgresHostTest = String(process.env.POSTGRES_HOST_TEST);
exports.postgresPortTest = String(process.env.POSTGRES_PORT_TEST);
/*  */
exports.postgresDatabaseProd = String(process.env.POSTGRES_DATABASE_PROD);
exports.postgresUserProd = String(process.env.POSTGRES_USER_PROD);
exports.postgresPasswordProd = String(process.env.POSTGRES_PASSWORD_PROD);
exports.postgresHostProd = String(process.env.POSTGRES_HOST_PROD);
exports.postgresPortProd = String(process.env.POSTGRES_PORT_PROD);
