import { RESTAPIService } from "../../../../config/dependencies";
import {
  addProject,
  addManyProject,
  getProjects,
  deleteProject,
  updateProject,
  migrateDescriptionToDescriptions,
  migrateRelationship2OneToN2N,
} from "../../application/use_cases";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("/projects", (router: any) => {
  router
    .get("/", controllerAdapter(getProjects))
    .post("/", controllerAdapter(addProject))
    .post("/projects", controllerAdapter(addManyProject))
    .delete("/", controllerAdapter(deleteProject))
    .delete("/:uuid", controllerAdapter(deleteProject))
    .patch("/", controllerAdapter(updateProject))
    .patch("/:uuid", controllerAdapter(updateProject))
    // ! this fucntion should not be exposed by an API controller, and if it, should be protected by a middleware of authorization
    .get(
      "/migrate_descriptions",
      controllerAdapter(migrateDescriptionToDescriptions)
    )
    .get(
      "/migrateRelationship2OneToN2N",
      controllerAdapter(migrateRelationship2OneToN2N)
    );
});
