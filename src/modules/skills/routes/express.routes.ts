import { Router } from "express";
import {
  addNewSkill,
  addManySkills,
  getAllSkills,
  deleteSkill,
  updateSkill,
} from "../use_cases";
import { expressHandlerAdapter } from "../../../adapters/apis/express";

const router = Router();

export default router
  .get("/", expressHandlerAdapter(getAllSkills))
  .post("/", expressHandlerAdapter(addNewSkill))
  .post("/skills", expressHandlerAdapter(addManySkills))
  .delete("/:uuid", expressHandlerAdapter(deleteSkill))
  .patch("/", expressHandlerAdapter(updateSkill))
  .patch("/:uuid", expressHandlerAdapter(updateSkill));
