import { Router } from "express";
import {
  registerUser,
  removeUser,
  updateUser,
  signin,
} from "../../../../application/use_cases/users";
import {createUserSchema}from "../../../schemas/user.schema"
import {validatorHandler} from "../middlewares/validator.handler"
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router
  .post("/signup", validatorHandler(createUserSchema, 'body'), expressHandlerAdapter(registerUser))
  .post("/signin", expressHandlerAdapter(signin))
  .post("/remove", expressHandlerAdapter(removeUser))
  .post("/update", expressHandlerAdapter(updateUser));

export default router;
