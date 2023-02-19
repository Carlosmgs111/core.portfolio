import { Router } from "express";
import projectRoutes from "../../../../../modules/projects/insfrastructure/apis/express/routes/api.routes/project.routes";
import userRoutes from "../../../../../modules/users/infrastructure/apis/express/routes/api.routes/user.routes";
import certificationRoutes from "../../../../../modules/certifications/infrastructure/apis/express/routes/api.routes/certification.routes";
import institutionRoutes from "../../../../../modules/institutions/infrastructure/apis/express/routes/api.routes//institution.routes";
import authRoutes from "../../../../../modules/users/infrastructure/apis/express/routes/api.routes/auth.routes";
import postRoutes from "../../../../../modules/posts/insfrasctructure/apis/express/routes/api.routes/post.routes";
import skillRoutes from "../../../../../modules/skills/infrastructure/apis/express/routes/api.routes/skill.routes";
import noteRoutes from "../../../../../modules/notes/insfrastructure/apis/express/routes/api.routes/note.routes";

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
