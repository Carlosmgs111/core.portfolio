import { apiConfig } from "../../../../config/dependencies";
import { Router } from "express";
import apiRoutes from "./api.routes";
import uiRoutes from "./ui.routes"

const router = Router();

router.use(`/api/${apiConfig.version}`, apiRoutes);
router.use(`/ui/${apiConfig.version}`, uiRoutes);

export default router;
