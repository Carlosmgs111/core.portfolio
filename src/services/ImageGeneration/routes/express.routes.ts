import { Router } from "express";
import { generateImage, availabelSettings } from "../";
import { expressHandlerAdapter } from "../../../adapters/apis/express";

const router = Router();

export default router
  .post("/generate", expressHandlerAdapter(generateImage))
  .get("/availablesettings", expressHandlerAdapter(availabelSettings));
