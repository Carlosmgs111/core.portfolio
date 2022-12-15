import app from "./infrastructure/apis/express/index";
import terminal from "./infrastructure/apis/terminal"
import { DatabaseService } from "./config/dependencies";
import "./infrastructure/repositories/mongoose";
DatabaseService.info();
(async () => {
  await app();
  await terminal();
})()
