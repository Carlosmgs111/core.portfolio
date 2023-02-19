import { Router } from "express";
import {
  addNewCertification,
  addManyCertifications,
  getCertifications,
  removeCertification,
  updateCertification,
} from "../../../../../application/certifications";
import { expressHandlerAdapter } from "../../../../../../../adapters/apis/express";
import { validatorHandler } from "../../../../../../../infrastructure/apis/express/middlewares/validator.handler";
import {
  createCertification,
  createCertifications,
  updateCertification as updateCertificationSchema,
} from "../../../../../../../infrastructure/schemas/certification.schema";

const router = Router();

export default router
  .post(
    "/",
    validatorHandler(createCertification, "body"),
    expressHandlerAdapter(addNewCertification)
  )
  .post(
    "/certifications",
    // validatorHandler(createCertifications, "body"),
    expressHandlerAdapter(addManyCertifications)
  )
  .get("/", expressHandlerAdapter(getCertifications))
  .get("/hello", (req: any, res: any) => {
    console.log("hello");
    res.send("Hello");
  })
  .get("/:username", expressHandlerAdapter(getCertifications))
  .delete("/", expressHandlerAdapter(removeCertification))
  .delete("/:uuid", expressHandlerAdapter(removeCertification))
  .patch(
    "/",
    validatorHandler(updateCertificationSchema, "body"),
    expressHandlerAdapter(updateCertification)
  );
