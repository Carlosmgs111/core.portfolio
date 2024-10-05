import {
  RESTAPIService,
  RepositoryService,
} from "../../../../config/dependencies";
import {
  addNewCertification,
  addManyCertifications,
  getCertifications,
  removeCertification,
  updateCertification,
  getOwnCertifications,
} from "../../application/use_cases";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("/certifications", (router: any) => {
  router
    .post(
      "/",
      controllerAdapter((ctx: any) =>
        addNewCertification(RepositoryService, ctx)
      )
    )
    .post(
      "/certifications",
      controllerAdapter((ctx: any) =>
        addManyCertifications(RepositoryService, ctx)
      )
    )
    .get(
      "/",
      controllerAdapter((ctx: any) => getCertifications(RepositoryService, ctx))
    )
    .get("/hello", (req: any, res: any) => {
      res.send("Hello");
    })
    .get(
      "/me",
      controllerAdapter((ctx: any) =>
        getOwnCertifications(RepositoryService, ctx)
      )
    )
    .get(
      "/:username",
      controllerAdapter((ctx: any) => getCertifications(RepositoryService, ctx))
    )
    .delete(
      "/",
      controllerAdapter((ctx: any) =>
        removeCertification(RepositoryService, ctx)
      )
    )
    .delete(
      "/:uuid",
      controllerAdapter((ctx: any) =>
        removeCertification(RepositoryService, ctx)
      )
    )
    .patch(
      "/",
      controllerAdapter((ctx: any) =>
        updateCertification(RepositoryService, ctx)
      )
    );
});
