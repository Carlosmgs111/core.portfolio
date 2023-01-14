import colors from "colors";
import app from "./infrastructure/apis/express/index";
import terminal from "./infrastructure/apis/terminal";
import { RepositoryService } from "./config/dependencies";
import "./infrastructure/repositories/mongoose";
RepositoryService.info();
(async () => {
  // await setInterval(() => {
  //   console.log("Syncing...");
  //   RepositoryService.sync();
  // }, 10000);
  await app();
  await terminal();
})();
