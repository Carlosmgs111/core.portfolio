import { Router } from "express";
import {
  addNewCertification,
  getCertifications,
} from "../../../../domain/use_cases/certifications";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router.post("/add", expressHandlerAdapter(addNewCertification));
router.get("/certifications", expressHandlerAdapter(getCertifications));

export default router;
