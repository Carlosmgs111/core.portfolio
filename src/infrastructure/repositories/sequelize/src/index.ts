import { Sequelize } from "sequelize";
import {
  postgresDatabaseDev,
  postgresUserDev,
  postgresPasswordDev,
  postgresHostDev,
  postgresPortDev,
} from "./config.env";

const PASSWORD = encodeURIComponent(postgresPasswordDev);

export const sequelize = new Sequelize(
  postgresDatabaseDev,
  postgresUserDev,
  PASSWORD,
  { host: postgresHostDev, port: Number(postgresPortDev), dialect: "postgres" }
);
