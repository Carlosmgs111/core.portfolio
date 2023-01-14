import { Router } from "express";
import projectRoutes from "./project.routes";
import userRoutes from "./user.routes";
import certificationRoutes from "./certification.routes";
import institutionRoutes from "./institution.routes";
import authRoutes from "./auth.routes";
import postRoutes from "./post.routes";
import skillRoutes from "./skill.routes";

const router = Router();

export default router
  .use("/projects", projectRoutes)
  .use("/users", userRoutes)
  .use("/certifications", certificationRoutes)
  .use("/institutions", institutionRoutes)
  .use("/posts", postRoutes)
  .use("/skills", skillRoutes)
  .use("", authRoutes)
