import {
  RESTAPIService,
  RepositoryService,
} from "../../../../config/dependencies";
import {
  addNewCertificate,
  addManyCertificates,
  getCertificates,
  removeCertificate,
  updateCertificate,
  getOwnCertificates,
} from "../../application/use_cases";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("/certificates", (router: any) => {
  router
    .post(
      "/",
      controllerAdapter((ctx: any) =>
        addNewCertificate(RepositoryService, ctx)
      )
    )
    .post(
      "/certificates",
      controllerAdapter((ctx: any) =>
        addManyCertificates(RepositoryService, ctx)
      )
    )
    .get(
      "/",
      controllerAdapter((ctx: any) => getCertificates(RepositoryService, ctx))
    )
    .get("/hello", (req: any, res: any) => {
      res.send("Hello");
    })
    .get(
      "/me",
      controllerAdapter((ctx: any) =>
        getOwnCertificates(RepositoryService, ctx)
      )
    )
    .get(
      "/:username",
      controllerAdapter((ctx: any) => getCertificates(RepositoryService, ctx))
    )
    .delete(
      "/",
      controllerAdapter((ctx: any) =>
        removeCertificate(RepositoryService, ctx)
      )
    )
    .delete(
      "/:uuid",
      controllerAdapter((ctx: any) =>
        removeCertificate(RepositoryService, ctx)
      )
    )
    .patch(
      "/",
      controllerAdapter((ctx: any) =>
        updateCertificate(RepositoryService, ctx)
      )
    );
});
