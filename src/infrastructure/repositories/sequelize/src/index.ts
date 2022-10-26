import { Sequelize } from "sequelize";
import {
  postgresUserProd,
  postgresPasswordProd,
  postgresHostProd,
  postgresPortProd,
  postgresDatabaseProd,
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

let ENV = null;
if (process.argv.includes("DEV")) ENV = "DEV";
if (process.argv.includes("PROD")) ENV = "PROD";

let database: string = (() => {
  if (ENV === "DEV") return postgresDatabaseDev;
  if (ENV === "PROD") return postgresDatabaseProd;
  return "test";
})();
let user: string = (() => {
  if (ENV === "DEV") return postgresUserDev;
  if (ENV === "PROD") return postgresUserProd;
  return "tester";
})();
let PASSWORD: string = (() => {
  if (ENV === "DEV") return encodeURIComponent(postgresPasswordDev);
  if (ENV === "PROD") return encodeURIComponent(postgresPasswordProd);
  return encodeURIComponent("password");
})();
let host: string = (() => {
  if (ENV === "DEV") return postgresHostDev;
  if (ENV === "PROD") return postgresHostProd;
  return "127.0.0.1";
})();
let port: number = (() => {
  if (ENV === "DEV") return Number(postgresPortDev);
  if (ENV === "PROD") return Number(postgresPortProd);
  return Number(5432);
})();

export const sequelize = new Sequelize(database, user, PASSWORD, {
  host,
  port,
  dialect: "postgres",
  logging: false, //console.log
});

(async (ENV: any) => {
  console.log({ ENV });
  if (ENV === "DEV") return;
  if (ENV === "PROD") return;
  await sequelize.sync({ alter: true });
})(ENV);
