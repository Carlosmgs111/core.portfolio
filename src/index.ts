import "colors";
import app from "./infrastructure/apis/express/index";
import terminal from "./infrastructure/apis/terminal";
import { RepositoryService, SocketService } from "./config/dependencies";

RepositoryService.info();
(async () => {
  await app();
  await terminal();
})();
