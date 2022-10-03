import { Router } from "express";
import {
  addNewCertification,
  addManyCertifications,
  getCertifications,
  removeCertification,
  updateCertification,
} from "../../../../application/use_cases/certifications";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router
  .post("/", expressHandlerAdapter(addNewCertification))
  .post("/certifications", expressHandlerAdapter(addManyCertifications))
  .get("/", expressHandlerAdapter(getCertifications))
  .delete("/", expressHandlerAdapter(removeCertification))
  .patch("/", expressHandlerAdapter(updateCertification));

export default router;
