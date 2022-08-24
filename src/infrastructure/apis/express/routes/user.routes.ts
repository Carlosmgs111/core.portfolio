import { Router } from "express";
import {
  registerUser,
  removeUser,
  updateUser,
  signin,
} from "../../../../application/use_cases/users";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router.post("/signup", expressHandlerAdapter(registerUser));
router.post("/signin", expressHandlerAdapter(signin));
router.post("/remove", expressHandlerAdapter(removeUser));
router.post("/update", expressHandlerAdapter(updateUser));

export default router;
