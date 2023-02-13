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

const PROD = true; // ? true for use in production
const USER = !PROD
  ? encodeURIComponent(postgresUserDev || "")
  : encodeURIComponent(postgresUserProd || "");
const PASSWORD = !PROD
  ? encodeURIComponent(postgresPasswordDev || "")
  : encodeURIComponent(postgresPasswordProd || "");
const URI = `postgres://${USER}:${PASSWORD}@${
  !PROD ? postgresHostDev : postgresHostProd
}:${!PROD ? postgresPortDev : postgresPortProd}/${
  !PROD ? postgresDatabaseDev : postgresDatabaseProd
}`;
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
