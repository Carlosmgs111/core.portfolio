import {postgresUser, postgresPassword, postgresHost, postgresPort, postgresDatabase} from "./config.env"

const USER = encodeURIComponent(postgresUser);
const PASSWORD = encodeURIComponent(postgresPassword);
const URI = `postgres://${USER}:${PASSWORD}@${postgresHost}:${postgresPort}/${postgresDatabase}`;

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
