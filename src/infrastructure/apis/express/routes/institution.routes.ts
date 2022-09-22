import { Router } from "express";
import {
  addNewInstitution,
  getAllInstitutions,
  updateInstitution,
  deleteInstitution
} from "../../../../application/use_cases/institutions";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router
  .post("/", expressHandlerAdapter(addNewInstitution))
  .get("/", expressHandlerAdapter(getAllInstitutions))
  .patch("/", expressHandlerAdapter(updateInstitution))
  .delete("/", expressHandlerAdapter(deleteInstitution))

export default router;
