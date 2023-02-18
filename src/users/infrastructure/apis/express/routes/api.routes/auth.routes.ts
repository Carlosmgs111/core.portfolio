import { Router } from "express";
import { signup, signin } from "../../../../../application/register";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../../../../../../infrastructure/schemas/user.schema";
import { validatorHandler } from "../../../../../../infrastructure/apis/express/middlewares/validator.handler";
import { expressHandlerAdapter } from "../../../../../../adapters/apis/express";

const router = Router();

export default router
  .post(
    "/signup",
    validatorHandler(createUserSchema, "body"),
    expressHandlerAdapter(signup)
  )
  .get(
    "/signin",
    validatorHandler(getUserSchema, "body"),
    expressHandlerAdapter(signin)
  )
  .post(
    "/signin",
    validatorHandler(getUserSchema, "body"),
    expressHandlerAdapter(signin)
  );
