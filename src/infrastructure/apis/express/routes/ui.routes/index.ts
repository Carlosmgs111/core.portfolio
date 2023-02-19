// ? Used for render views
import { Router } from "express";
import certificationRoutes from "../../../../../modules/certifications/infrastructure/apis/express/routes/ui.routes/certification.routes";

const router = Router();

router.use("/certifications", certificationRoutes);

export default router;
