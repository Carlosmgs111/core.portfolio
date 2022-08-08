import { Sequelize } from "sequelize";
import config from "../../../config"

export const sequelize = new Sequelize(
  config.postgresDatabase,
  config.postgresUser,
  config.postgresPassword,
  { host: "localhost", dialect: "postgres" }
);
  