import { Router } from "express";
import {
  registerUser,
  removeUser,
  updateUser,
  signin,
} from "../../../../application/use_cases/users";
import { createUserSchema, getUserSchema, updateUserSchema } from "../../../schemas/user.schema";
import { validatorHandler } from "../middlewares/validator.handler";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router
  .get(
    "/",
    validatorHandler(getUserSchema, "body"),
    expressHandlerAdapter(signin)
  )
  .get(
    "/:email",
    validatorHandler(getUserSchema, "params"),
    expressHandlerAdapter(signin)
  )
  .post(
    "/",
    validatorHandler(createUserSchema, "body"),
    expressHandlerAdapter(registerUser)
  )
  .patch(
    "/",
    validatorHandler(updateUserSchema, "body"),
    expressHandlerAdapter(updateUser)
  )
  .delete(
    "/",
    validatorHandler(getUserSchema, "body"),
    expressHandlerAdapter(removeUser)
  );

export default router;
