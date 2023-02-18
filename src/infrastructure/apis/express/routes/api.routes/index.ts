import { Router } from "express";
import projectRoutes from "./project.routes";
import userRoutes from "../../../../../users/infrastructure/apis/express/routes/api.routes//user.routes";
import certificationRoutes from "../../../../../certifications/infrastructure/apis/express/routes/api.routes/certification.routes";
import institutionRoutes from "./institution.routes";
import authRoutes from "../../../../../users/infrastructure/apis/express/routes/api.routes/auth.routes";
import postRoutes from "./post.routes";
import skillRoutes from "./skill.routes";
import noteRoutes from "./note.routes";

const router = Router();

export default router
  .use("/projects", projectRoutes)
  .use("/users", userRoutes)
  .use("/certifications", certificationRoutes)
  .use("/institutions", institutionRoutes)
  .use("/posts", postRoutes)
  .use("/skills", skillRoutes)
  .use("/notes", noteRoutes)
  .use("", authRoutes);
