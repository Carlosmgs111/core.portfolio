import { Router } from "express";
import { signup, signin } from "../../../../application/use_cases/register";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../../../schemas/user.schema";
import { validatorHandler } from "../middlewares/validator.handler";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router
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
  );;

export default router;
