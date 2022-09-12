import {
  postgresUserDev,
  postgresPasswordDev,
  postgresHostDev,
  postgresPortDev,
  postgresDatabaseDev,
} from "./config.env";

const USER = encodeURIComponent(postgresUserDev);
const PASSWORD = encodeURIComponent(postgresPasswordDev);
const URI = `postgres://${USER}:${PASSWORD}@${postgresHostDev}:${postgresPortDev}/${postgresDatabaseDev}`;
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
