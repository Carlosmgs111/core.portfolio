import { Router } from "express";
import {
  addProject,
  getAllProjects,
  deleteProject
} from "../../../../application/use_cases/projects";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router
  .get("/", expressHandlerAdapter(getAllProjects))
  .post("/", expressHandlerAdapter(addProject))
  .delete("/", expressHandlerAdapter(deleteProject))

export default router;
