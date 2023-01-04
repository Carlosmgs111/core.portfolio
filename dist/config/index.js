"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const config = {
    mongoDBLocalUrl: process.env.MONGODB_LOCAL_URL && String(process.env.MONGODB_LOCAL_URL),
    mongoDBLocalTestUrl: process.env.MONGODB_LOCAL_TEST_URL &&
        String(process.env.MONGODB_LOCAL_TEST_URL),
    mongoDBAtlasURL: process.env.MONGODB_ATLAS_URL && String(process.env.MONGODB_ATLAS_URL),
    /*  */
    postgresDatabase: process.env.POSTGRES_DATABASE && String(process.env.POSTGRES_DATABASE),
    postgresUser: process.env.POSTGRES_USER && String(process.env.POSTGRES_USER),
    postgresPassword: process.env.POSTGRES_PASSWORD && String(process.env.POSTGRES_PASSWORD),
    postgresHost: process.env.POSTGRES_HOST && String(process.env.POSTGRES_HOST),
    postgresPort: process.env.POSTGRES_PORT && String(process.env.POSTGRES_PORT),
    /*  */
    postgresDatabaseDev: process.env.POSTGRES_DATABASE_DEV &&
        String(process.env.POSTGRES_DATABASE_DEV),
    postgresUserDev: process.env.POSTGRES_USER_DEV && String(process.env.POSTGRES_USER_DEV),
    postgresPasswordDev: process.env.POSTGRES_PASSWORD_DEV &&
        String(process.env.POSTGRES_PASSWORD_DEV),
    postgresHostDev: process.env.POSTGRES_HOST_DEV && String(process.env.POSTGRES_HOST_DEV),
    postgresPortDev: process.env.POSTGRES_PORT_DEV && String(process.env.POSTGRES_PORT_DEV),
    /*  */
    serverPort: process.env.PORT && String(process.env.PORT),
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET && String(process.env.JWT_ACCESS_SECRET),
    jwtSignupSecret: process.env.JWT_SIGNUP_SECRET && String(process.env.JWT_SIGNUP_SECRET),
    apiKey: process.env.API_KEY && String(process.env.API_KEY),
    // jwtResetPasswordSecret: String(process.env.JWT_RESET_PASSWORD_SECRET),
    jwtExp: process.env.TOKEN_EXPIRATION,
    test: process.env.test && String(process.env.test),
    // apiKey: String(process.env.API_KEY),
    // emailAddress: process.env.EMAIL_ADDRESS,
    // emailAppPassword: process.env.EMAIL_APP_PASSWORD,
    // neo4jProtocol: process.env.NEO4J_PROTOCOL,
    // neo4jHost: process.env.NEO4J_HOST,
    // neo4jUsername: process.env.NEO4J_USERNAME,
    // neo4jPassword: process.env.NEO4J_PASSWORD,
    // neo4jPort: process.env.NEO4J_PORT,
};
exports.default = config;
