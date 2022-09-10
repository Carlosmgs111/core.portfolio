
require("dotenv").config();

export const postgresDatabase = String(process.env.POSTGRES_DATABASE)
export const postgresUser =  String(process.env.POSTGRES_USER)
export const postgresPassword= String(process.env.POSTGRES_PASSWORD)
export const postgresHost=String(process.env.POSTGRES_HOST)
export const postgresPort=String(process.env.POSTGRES_PORT)