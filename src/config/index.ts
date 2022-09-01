require("dotenv").config();
const config = {
  mongoDBLocalUrl: String(process.env.MONGODB_LOCAL_URL),
  mongoDBLocalTestUrl: String(process.env.MONGODB_LOCAL_TEST_URL),
  mongoDBAtlasURL: String(process.env.MONGODB_ATLAS_URL),
  postgresDatabase: String(process.env.POSTGRES_DATABASE),
  postgresUser: String(process.env.POSTGRES_USER),
  postgresPassword: String(process.env.POSTGRES_PASSWORD),
  postgresHost:String(process.env.POSTGRES_HOST),
  postgresPort:String(process.env.POSTGRES_PORT),
  serverPort: String(process.env.PORT),
  jwtAccessSecret: String(process.env.JWT_ACCESS_SECRET),
  jwtSignupSecret: String(process.env.JWT_SIGNUP_SECRET),
  // jwtResetPasswordSecret: String(process.env.JWT_RESET_PASSWORD_SECRET),
  jwtExp: process.env.TOKEN_EXPIRATION,
  // apiKey: String(process.env.API_KEY),
  // emailAddress: process.env.EMAIL_ADDRESS,
  // emailAppPassword: process.env.EMAIL_APP_PASSWORD,
  // neo4jProtocol: process.env.NEO4J_PROTOCOL,
  // neo4jHost: process.env.NEO4J_HOST,
  // neo4jUsername: process.env.NEO4J_USERNAME,
  // neo4jPassword: process.env.NEO4J_PASSWORD,
  // neo4jPort: process.env.NEO4J_PORT,
};

export default config;
