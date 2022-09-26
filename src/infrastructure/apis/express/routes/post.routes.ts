import { Router } from "express";
import {
  addPost,
  getAllPosts,
  removePost,
  updatePost
} from "../../../../application/use_cases/posts";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

const router = Router();

router
  .post("/", expressHandlerAdapter(addPost))
  .get("/", expressHandlerAdapter(getAllPosts))
  .delete("/", expressHandlerAdapter(removePost))
  .patch("/", expressHandlerAdapter(updatePost))

export default router;
