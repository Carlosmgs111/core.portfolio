import express from "express";
import config from "../../../config";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";
import {join, dirname} from "path"
import {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} from "./middlewares/error.handler";
// import authRoutes from "./routes/auth.routes";
// import passport from "../../auth/passport";
import { grantUrls } from "./middlewares/grantUrls.handler";
// Create a new app server

export const app = express();

app.set("port", config.serverPort);
app.use(morgan("dev"));
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'pug') 
app.set('views', join(dirname(dirname(__dirname)), 'templates'))
// app.use(authRoutes);
// app.use(passport);
app.use(
  grantUrls([
    [["signin", "signup"], ["POST"]],
    [["certifications", "institutions", "hello"]],
  ])
);
/* to check */
app.use((req: any, res: any, next: any) => {
  // Dominio que tengan acceso (ej. 'http://example.com')
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Metodos de solicitud que deseas permitir
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE"
  );
  // Encabecedados que permites (ej. 'X-Requested-With,content-type')
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
app.use(routes);
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

export default () =>
  app.listen(app.get("port"), () => {
    console.log(`🚀💼 Portfolio app listening on port ${app.get("port")}`);
  });
