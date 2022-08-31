import { Router } from "express";
import {
  registerUser,
  removeUser,
  updateUser,
  signin,
} from "../../../../application/use_cases/users";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router
  .post("/signup", expressHandlerAdapter(registerUser))
  .post("/signin", expressHandlerAdapter(signin))
  .post("/remove", expressHandlerAdapter(removeUser))
  .post("/update", expressHandlerAdapter(updateUser));

export default router;
