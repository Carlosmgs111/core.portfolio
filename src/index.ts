import "colors";
import app from "./infrastructure/apis/express/index";
import terminal from "./infrastructure/apis/terminal";
import { RepositoryService, TaskMessageService } from "./config/dependencies";
import fs from "fs";

TaskMessageService.sendMessage("generateImage", "Generate Image");
TaskMessageService.receiveMessage("imageGenerated", async (message: any) => {
  console.log("Message received");
  const decodedImage = Buffer.from(message, "base64");
  fs.writeFile("datasets/images/image.png", decodedImage, (err) => {
    if (err) throw err;
    console.log("La imagen fue guardada correctamente");
  });
});
RepositoryService.info();
(async () => {
  await app();
  await terminal();
})();
