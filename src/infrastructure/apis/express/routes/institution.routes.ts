import { Router } from "express";
import { addNewInstitution } from "../../../../domain/use_cases/institutions";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router.post("/add", expressHandlerAdapter(addNewInstitution));

export default router;