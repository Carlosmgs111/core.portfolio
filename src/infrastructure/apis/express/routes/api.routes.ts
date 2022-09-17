import { Router } from "express";
import projectRoutes from "./project.routes";
import userRoutes from "./user.routes";
import certificationRoutes from "./certification.routes";
import institutionRoutes from "./institution.routes";
import authRoutes from "./auth.routes"

const router = Router();

router.use("/projects", projectRoutes);
router.use("/users", userRoutes);
router.use("/certifications", certificationRoutes);
router.use("/institutions", institutionRoutes);
router.use("",authRoutes)

export default router;