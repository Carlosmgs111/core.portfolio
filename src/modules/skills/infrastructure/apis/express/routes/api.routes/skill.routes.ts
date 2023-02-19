import { Router } from "express";
import {
  addNewSkill,
  addManySkills,
  getAllSkills,
  deleteSkill,
  updateSkill,
} from "../../../../../application/skills";
import { expressHandlerAdapter } from "../../../../../../../adapters/apis/express";

const router = Router();

export default router
  .get("/", expressHandlerAdapter(getAllSkills))
  .post("/", expressHandlerAdapter(addNewSkill))
  .post("/skills", expressHandlerAdapter(addManySkills))
  .delete("/", expressHandlerAdapter(deleteSkill))
  .patch("/", expressHandlerAdapter(updateSkill))
  .patch("/:uuid", expressHandlerAdapter(updateSkill));
