import {
  RESTAPIService,
  RepositoryService,
} from "../../../../config/dependencies";
import {
  addNewInstitution,
  getAllInstitutions,
  updateInstitution,
  deleteInstitution,
} from "../../application/use_cases";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("/institutions", (router: any) => {
  router
    .post(
      "/",
      controllerAdapter((ctx: any) => addNewInstitution(RepositoryService, ctx))
    )
    .get("/", controllerAdapter((ctx: any) => getAllInstitutions(RepositoryService, ctx)))
    .patch("/", controllerAdapter((ctx: any) => updateInstitution(RepositoryService, ctx)))
    .delete("/", controllerAdapter((ctx: any) => deleteInstitution(RepositoryService, ctx)));
});
