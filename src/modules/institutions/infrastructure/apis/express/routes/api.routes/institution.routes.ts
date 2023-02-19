import { Router } from "express";
import {
  addNewInstitution,
  getAllInstitutions,
  updateInstitution,
  deleteInstitution
} from "../../../../../application/institutions";
import { expressHandlerAdapter } from "../../../../../../../adapters/apis/express";

const router = Router();

export default router
  .post("/", expressHandlerAdapter(addNewInstitution))
  .get("/", expressHandlerAdapter(getAllInstitutions))
  .patch("/", expressHandlerAdapter(updateInstitution))
  .delete("/", expressHandlerAdapter(deleteInstitution))

