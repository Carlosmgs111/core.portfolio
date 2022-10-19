import { Router } from "express";
import {
  addNewSkill,
  getAllSkills,
  deleteSkill,
  updateSkill
} from "../../../../../application/use_cases/skills";
import { expressHandlerAdapter } from "../../../../../adapters/apis/express";

const router = Router();

export default router
  .get("/", expressHandlerAdapter(getAllSkills))
  .post("/", expressHandlerAdapter(addNewSkill))
  .delete("/", expressHandlerAdapter(deleteSkill))
  .patch("/", expressHandlerAdapter(updateSkill))
  
