import { Router } from "express";
import { expressHandlerAdapter } from "../../../../../../../../../adapters/apis/express";
import { resetPassword } from "../../../../../../../application/register";

const router = Router();

export default router.patch("/reset", expressHandlerAdapter(resetPassword));
