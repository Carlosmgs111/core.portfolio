import { Router } from "express";
import passwordRoutes from "./password.routes";
import {
  registerUser,
  removeUser,
  updateUser,
  sayHello,
  changeUsername,
  updateAvatar,
  getAllUsername,
} from "../../use_cases";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../../../../infrastructure/schemas/user.schema";
import { validatorHandler } from "../../../../infrastructure/apis/express/middlewares/validator.handler";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

export default router
  .get("/sayhello", expressHandlerAdapter(sayHello))
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
  .patch("/username/change", expressHandlerAdapter(changeUsername))
  .get("/username/all", expressHandlerAdapter(getAllUsername))
  .patch("/avatar/update", expressHandlerAdapter(updateAvatar))
  .use("/password", passwordRoutes);
