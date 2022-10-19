// ? Used for render views 
import { Router } from "express";
import certificationRoutes from "./certification.routes";

const router = Router();

router.use("/certifications", certificationRoutes);

export default router;