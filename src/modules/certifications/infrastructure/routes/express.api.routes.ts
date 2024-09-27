import { RESTAPIService } from "../../../../config/dependencies";
import {
  addNewCertification,
  addManyCertifications,
  getCertifications,
  removeCertification,
  updateCertification,
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
      controllerAdapter(addNewCertification)
    )
    .post(
      "/certifications",
      // validatorHandler(createCertifications, "body"),
      controllerAdapter(addManyCertifications)
    )
    .get("/", controllerAdapter(getCertifications))
    .get("/hello", (req: any, res: any) => {
      ("hello");
      res.send("Hello");
    })
    .get("/:username", controllerAdapter(getCertifications))
    .delete("/", controllerAdapter(removeCertification))
    .delete("/:uuid", controllerAdapter(removeCertification))
    .patch(
      "/",
      // validatorHandler(updateCertificationSchema, "body"),
      controllerAdapter(updateCertification)
    );
});
