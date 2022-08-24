import { Router } from "express";
import { addProject, getAllProjects } from "../../../../application/use_cases/projects";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router.get("/projects", expressHandlerAdapter(getAllProjects));
router.post("/add", expressHandlerAdapter(addProject));

export default router;
