import {
  postgresUserDev,
  postgresPasswordDev,
  postgresHostDev,
  postgresPortDev,
  postgresDatabaseDev,
  postgresUserProd,
  postgresPasswordProd,
  postgresHostProd,
  postgresPortProd,
  postgresDatabaseProd,
} from "./config.env";

const USER = encodeURIComponent(postgresUserDev || postgresUserProd);
const PASSWORD = encodeURIComponent(postgresPasswordDev || postgresPasswordProd);
const URI = `postgres://${USER}:${PASSWORD}@${postgresHostDev || postgresHostProd}:${postgresPortDev || postgresPortProd}/${postgresDatabaseDev || postgresDatabaseProd}`;
export = {
  development: {
    url: URI,
    dialect: "postgres",
  },
  production: {
    url: URI,
    dialect: "postgres",
  },
};
