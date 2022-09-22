require("dotenv").config();

export const postgresDatabase = String(process.env.POSTGRES_DATABASE);
export const postgresUser = String(process.env.POSTGRES_USER);
export const postgresPassword = String(process.env.POSTGRES_PASSWORD);
export const postgresHost = String(process.env.POSTGRES_HOST);
export const postgresPort = String(process.env.POSTGRES_PORT);
/*  */
export const postgresDatabaseDev = String(process.env.POSTGRES_DATABASE_DEV);
export const postgresUserDev = String(process.env.POSTGRES_USER_DEV);
export const postgresPasswordDev = String(process.env.POSTGRES_PASSWORD_DEV);
export const postgresHostDev = String(process.env.POSTGRES_HOST_DEV);
export const postgresPortDev = String(process.env.POSTGRES_PORT_DEV);
/*  */
export const postgresDatabaseTest = String(process.env.POSTGRES_DATABASE_TEST);
export const postgresUserTest = String(process.env.POSTGRES_USER_TEST);
export const postgresPasswordTest = String(process.env.POSTGRES_PASSWORD_TEST);
export const postgresHostTest = String(process.env.POSTGRES_HOST_TEST);
export const postgresPortTest = String(process.env.POSTGRES_PORT_TEST);
