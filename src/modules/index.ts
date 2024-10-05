import "./certificates";
import "./users";
import "./institutions";
import "./projects";

// TODO ⬇️ This should goes located into each module

import {
  RESTAPIService,
  RepositoryService,
  apiConfig,
  uiConfig,
} from "../config/dependencies";
import certificationsRoutes from "../modules/certificates/infrastructure/routes/express.api.routes";
import expressUiRoutes from "./certificates/infrastructure/routes/express.ui.routes";
import projectsRoutes from "../modules/projects/infrastructure/routes/express.routes";
import usersRoutes from "../modules/users/infrastructure/routes/express.routes";
import institutionsRoutes from "../modules/institutions/infrastructure/routes/express.routes";
import authRoutes from "./shared/auth/infrastructure/routes/express.routes";
/*  */
import imageRoutes from "../services/ImageGeneration/routes/express.routes";

RESTAPIService.router.use(
  `/api/${apiConfig.version}`,
  certificationsRoutes,
  projectsRoutes,
  usersRoutes,
  institutionsRoutes,
  authRoutes,
  imageRoutes
);
RESTAPIService.router.use(`/ui/${uiConfig.version}`, expressUiRoutes);

RepositoryService.CommandService.joinTables("User", "Certification");
RepositoryService.CommandService.joinTables("User", "Institution");
RepositoryService.CommandService.joinTables("User", "Project");
RepositoryService.CommandService.syncModels();
RepositoryService.info();

