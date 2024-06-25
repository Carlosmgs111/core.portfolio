import "colors";
import app from "./infrastructure/apis/express/index";
import terminal from "./infrastructure/apis/terminal";
import { RepositoryService } from "./config/dependencies";

RepositoryService.info();

(async () => {
  await app();
  await terminal();
})();
