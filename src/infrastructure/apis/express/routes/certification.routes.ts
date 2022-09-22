import { Router } from "express";
import {
  addNewCertification,
  getCertifications,
  removeCertification,
  updateCertification,
} from "../../../../application/use_cases/certifications";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router
  .post("/", expressHandlerAdapter(addNewCertification))
  .get("/", expressHandlerAdapter(getCertifications))
  .delete("/", expressHandlerAdapter(removeCertification))
  .patch("/", expressHandlerAdapter(updateCertification));

export default router;
