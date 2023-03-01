import { Router } from "express";
import { generateImage } from "../";
import { expressHandlerAdapter } from "../../../adapters/apis/express";

const router = Router();

export default router.post("/generate", expressHandlerAdapter(generateImage));
