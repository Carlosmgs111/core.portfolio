// ? Used for render views
import { Router } from "express";
import certificationRoutes from "../../../../../modules/certifications/routes/express.ui.routes";

const router = Router();

router.use("/certifications", certificationRoutes);

export default router;
