import "./certifications";
import "./users";
import "./institutions";
import "./projects";
import {
  RESTAPIService,
  RepositoryService,
  apiConfig,
} from "../config/dependencies";
import certificationsRoutes from "../modules/certifications/infrastructure/routes/express.api.routes";
import projectsRoutes from "../modules/projects/infrastructure/routes/express.routes";
import usersRoutes from "../modules/users/infrastructure/routes/express.routes";
import institutionsRoutes from "../modules/institutions/infrastructure/routes/express.routes";
import authRoutes from "./shared/auth/infrastructure/routes/express.routes";

RESTAPIService.router.use(
  `/api/${apiConfig.version}`,
  certificationsRoutes,
  projectsRoutes,
  usersRoutes,
  institutionsRoutes,
  authRoutes
);

RepositoryService.CommandService.joinTables("User", "Certification");
RepositoryService.CommandService.joinTables("User", "Institution");
RepositoryService.CommandService.joinTables("User", "Project");
RepositoryService.CommandService.syncModels();
RepositoryService.info();
