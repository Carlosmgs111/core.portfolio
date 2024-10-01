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
// import { validatorHandler } from "../../../infrastructure/apis/express/middlewares/validator.handler";
import {
  createCertification,
  createCertifications,
  updateCertification as updateCertificationSchema,
} from "../../../../infrastructure/schemas/certification.schema";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("/certifications", (router: any) => {
  router
    .post(
      "/",
      // validatorHandler(createCertification, "body"),
      controllerAdapter((ctx: any) =>
        addNewCertification(RepositoryService, ctx)
      )
    )
    .post(
      "/certifications",
      // validatorHandler(createCertifications, "body"),
      controllerAdapter((ctx: any) =>
        addManyCertifications(RepositoryService, ctx)
      )
    )
    .get(
      "/",
      controllerAdapter((ctx: any) => getCertifications(RepositoryService, ctx))
    )
    .get("/hello", (req: any, res: any) => {
      ("hello");
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
      // validatorHandler(updateCertificationSchema, "body"),
      controllerAdapter((ctx: any) =>
        updateCertification(RepositoryService, ctx)
      )
    );
});
