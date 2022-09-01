import express from "express";
import config from "../../../config";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";
// import authRoutes from "./routes/auth.routes";
// import passport from "../../auth/passport";
// import { authMiddleware } from "./middlewares/auth.handler";
// Create a new app server

export const app = express();

app.set("port", config.serverPort);
app.use(morgan("dev"));
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(authRoutes);
// app.use(passport);
// /* to check */
// app.use(authMiddleware);
/* to check */
app.use((req: any, res: any, next: any) => {
  // Dominio que tengan acceso (ej. 'http://example.com')
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Metodos de solicitud que deseas permitir
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  // Encabecedados que permites (ej. 'X-Requested-With,content-type')
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
app.use(routes);

export default (()=>app.listen(app.get("port"), () => {
  console.log(`🚀💼 Portfolio app listening on port ${app.get("port")}`);
}));;
