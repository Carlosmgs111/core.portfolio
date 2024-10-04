import {
  RepositoryService,
  RESTAPIService,
} from "../../../../config/dependencies";
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
    .get(
      "/",
      controllerAdapter((ctx: any) => getProjects(RepositoryService, ctx))
    )
    .post(
      "/",
      controllerAdapter((ctx: any) => addProject(RepositoryService, ctx))
    )
    .post(
      "/projects",
      controllerAdapter((ctx: any) => addManyProject(RepositoryService, ctx))
    )
    .delete(
      "/",
      controllerAdapter((ctx: any) => deleteProject(RepositoryService, ctx))
    )
    .delete(
      "/:uuid",
      controllerAdapter((ctx: any) => deleteProject(RepositoryService, ctx))
    )
    .patch(
      "/",
      controllerAdapter((ctx: any) => updateProject(RepositoryService, ctx))
    )
    .patch(
      "/:uuid",
      controllerAdapter((ctx: any) => updateProject(RepositoryService, ctx))
    )
    // ! this fucntion should not be exposed by an API controller, and if it, should be protected by a middleware of authorization
    .get(
      "/migrate_descriptions",
      controllerAdapter((ctx: any) =>
        migrateDescriptionToDescriptions(RepositoryService, ctx)
      )
    )
    .get(
      "/migrateRelationship2OneToN2N",
      controllerAdapter((ctx: any) =>
        migrateRelationship2OneToN2N(RepositoryService)
      )
    );
});
