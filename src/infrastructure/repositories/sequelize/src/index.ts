import { Sequelize } from "sequelize";
import {
  postgresDatabaseDev,
  postgresUserDev,
  postgresPasswordDev,
  postgresHostDev,
  postgresPortDev,
  postgresDatabaseTest,
  postgresUserTest,
  postgresPasswordTest,
  postgresHostTest,
  postgresPortTest,
} from "./config.env";

const ENV = process.argv.includes("DEV") ? "DEV" : "PROD";

let database: string = (() => {
  if (ENV === "DEV") return postgresDatabaseDev;
  return "test";
})();
let user: string = (() => {
  if (ENV === "DEV") return postgresUserDev;
  return "tester";
})();
let PASSWORD: string = (() => {
  if (ENV === "DEV") return encodeURIComponent(postgresPasswordDev);
  return encodeURIComponent("password");
})();
let host: string = (() => {
  if (ENV === "DEV") return postgresHostDev;
  return "127.0.0.1";
})();
let port: number = (() => {
  if (ENV === "DEV") return Number(postgresPortDev);
  return Number(5432);
})();

export const sequelize = new Sequelize(database, user, PASSWORD, {
  host,
  port,
  dialect: "postgres",
  logging: false//console.log
});

if (ENV !== "DEV")
  (async () => {
    await sequelize.sync({ alter: true });
  })();
