import { Router } from "express";
import passwordRoutes from "./password.routes";
import {
  registerUser,
  removeUser,
  updateUser,
  signin,
  sayHello,
} from "../../../../../../application/use_cases/users";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../../../../../schemas/user.schema";
import { validatorHandler } from "../../../middlewares/validator.handler";
import { expressHandlerAdapter } from "../../../../../../adapters/apis/express";

const router = Router();

export default router
  .get(
    "/",
    validatorHandler(getUserSchema, "body"),
    expressHandlerAdapter(signin)
  )
  .get("/sayhello", expressHandlerAdapter(sayHello))
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
  )
  .use("/password", passwordRoutes);
