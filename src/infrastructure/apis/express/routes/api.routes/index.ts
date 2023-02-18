import { Router } from "express";
import projectRoutes from "../../../../../projects/insfrastructure/apis/express/routes/api.routes/project.routes";
import userRoutes from "../../../../../users/infrastructure/apis/express/routes/api.routes/user.routes";
import certificationRoutes from "../../../../../certifications/infrastructure/apis/express/routes/api.routes/certification.routes";
import institutionRoutes from "../../../../../institutions/infrastructure/apis/express/routes/api.routes//institution.routes";
import authRoutes from "../../../../../users/infrastructure/apis/express/routes/api.routes/auth.routes";
import postRoutes from "../../../../../posts/insfrasctructure/apis/express/routes/api.routes/post.routes";
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
