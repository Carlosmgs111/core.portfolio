require("dotenv").config();

export const postgresDatabase = process.env.POSTGRES_DATABASE;
export const postgresUser = process.env.POSTGRES_USER;
export const postgresPassword = process.env.POSTGRES_PASSWORD;
export const postgresHost = process.env.POSTGRES_HOST;
export const postgresPort = process.env.POSTGRES_PORT;
/*  */
export const postgresDatabaseDev = process.env.POSTGRES_DATABASE_DEV;
export const postgresUserDev = process.env.POSTGRES_USER_DEV;
export const postgresPasswordDev = process.env.POSTGRES_PASSWORD_DEV;
export const postgresHostDev = process.env.POSTGRES_HOST_DEV;
export const postgresPortDev = process.env.POSTGRES_PORT_DEV;
/*  */
export const postgresDatabaseTest = process.env.POSTGRES_DATABASE_TEST;
export const postgresUserTest = process.env.POSTGRES_USER_TEST;
export const postgresPasswordTest = process.env.POSTGRES_PASSWORD_TEST;
export const postgresHostTest = process.env.POSTGRES_HOST_TEST;
export const postgresPortTest = process.env.POSTGRES_PORT_TEST;
/*  */
export const postgresDatabaseProd = process.env.POSTGRES_DATABASE_PROD;
export const postgresUserProd = process.env.POSTGRES_USER_PROD;
export const postgresPasswordProd = process.env.POSTGRES_PASSWORD_PROD;
export const postgresHostProd = process.env.POSTGRES_HOST_PROD;
export const postgresPortProd = process.env.POSTGRES_PORT_PROD;
