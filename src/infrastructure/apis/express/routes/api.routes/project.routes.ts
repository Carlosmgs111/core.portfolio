import { Router } from "express";
import {
  addProject,
  addManyProject,
  getProjects,
  deleteProject,
  updateProject,
  migrateDescriptionToDescriptions,
  migrateRelationship2OneToN2N,
} from "../../../../../application/use_cases/projects";
import { expressHandlerAdapter } from "../../../../../adapters/apis/express";

const router = Router();

export default router
  .get("/", expressHandlerAdapter(getProjects))
  .post("/", expressHandlerAdapter(addProject))
  .post("/projects", expressHandlerAdapter(addManyProject))
  .delete("/", expressHandlerAdapter(deleteProject))
  .delete("/:uuid", expressHandlerAdapter(deleteProject))
  .patch("/", expressHandlerAdapter(updateProject))
  .patch("/:uuid", expressHandlerAdapter(updateProject))
  // ! this fucntion should not be exposed by an API controller, and if it, should be protected by a middleware of authorization
  .get(
    "/migrate_descriptions",
    expressHandlerAdapter(migrateDescriptionToDescriptions)
  )
  .get(
    "/migrateRelationship2OneToN2N",
    expressHandlerAdapter(migrateRelationship2OneToN2N)
  );
