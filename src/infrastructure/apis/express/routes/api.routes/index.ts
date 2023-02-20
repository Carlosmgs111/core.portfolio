import { Router } from "express";
import projectRoutes from "../../../../../modules/projects/routes/express.routes";
import userRoutes from "../../../../../modules/users/routes/express.routes";
import certificationRoutes from "../../../../../modules/certifications/routes/express.api.routes";
import institutionRoutes from "../../../../../modules/institutions/routes/express.routes";
import authRoutes from "../../../../../modules/users/routes/express.auth.routes";
import postRoutes from "../../../../../modules/posts/routes/express.routes";
import skillRoutes from "../../../../../modules/skills/routes/express.routes";
import noteRoutes from "../../../../../modules/notes/routes/express.routes";

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
