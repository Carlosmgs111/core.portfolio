import { Router } from "express";
import {
  addNewCertification,
  getCertifications,
} from "../../../../application/use_cases/certifications";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router.post("/", expressHandlerAdapter(addNewCertification));
router.get("/", expressHandlerAdapter(getCertifications));

export default router;
