import { Router } from "express";
const router = Router();
import { createNewNote, getMyNotes } from "../../../../../application/notes";
import { expressHandlerAdapter } from "../../../../../../../adapters/apis/express";

export default router
  .get("/mynotes", expressHandlerAdapter(getMyNotes))
  .post("/", expressHandlerAdapter(createNewNote));
