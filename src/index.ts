import "colors";
import app from "./infrastructure/apis/express/index";
import terminal from "./infrastructure/apis/terminal";
import { RepositoryService, TaskMessageService } from "./config/dependencies";

TaskMessageService.receiveMessage("imageGenerated", async(message: any) => {
  console.log({ message });
});
RepositoryService.info();
(async () => {
  await app();
  await terminal();
})();
