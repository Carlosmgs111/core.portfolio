import { Router } from "express";
import {
  addNewCertification,
  addManyCertifications,
  getCertifications,
  getCertificationsByUsername,
  removeCertification,
  updateCertification,
} from "../../../../../application/use_cases/certifications";
import { expressHandlerAdapter } from "../../../../../adapters/apis/express";
import { validatorHandler } from "../../middlewares/validator.handler";
import {
  createCertification,
  createCertifications,
  updateCertification as updateCertificationSchema,
} from "../../../../schemas/certification.schema";

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
  .get("/:username", expressHandlerAdapter(getCertificationsByUsername))
  .delete("/", expressHandlerAdapter(removeCertification))
  .delete("/:uuid", expressHandlerAdapter(removeCertification))
  .patch(
    "/",
    validatorHandler(updateCertificationSchema, "body"),
    expressHandlerAdapter(updateCertification)
  );
