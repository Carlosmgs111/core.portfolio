import { Router } from "express";
import {
  addPost,
  getAllPosts,
  removePost,
  updatePost,
} from "../../../../../../posts/application/posts";
import { expressHandlerAdapter } from "../../../../../../../adapters/apis/express";

const router = Router();

export default router
  .post("/", expressHandlerAdapter(addPost))
  .get("/", expressHandlerAdapter(getAllPosts))
  .delete("/", expressHandlerAdapter(removePost))
  .patch("/", expressHandlerAdapter(updatePost));
