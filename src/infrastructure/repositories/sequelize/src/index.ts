import { Sequelize } from "sequelize";
import { postgresDatabase, postgresUser, postgresPassword } from "./config.env";

export const sequelize = new Sequelize(
  postgresDatabase,
  postgresUser,
  postgresPassword,
  { host: "localhost", dialect: "postgres" }
);
