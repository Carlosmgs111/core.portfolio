import { Router } from "express";
import { generateImage, availabelSettings, modifyImages } from "../";
import { expressHandlerAdapter } from "../../../adapters/apis/express";

const router = Router();

export default router
  .post("/generate", expressHandlerAdapter(generateImage))
  .get("/availablesettings", expressHandlerAdapter(availabelSettings))
  .post("/modifyimages", expressHandlerAdapter(modifyImages));
