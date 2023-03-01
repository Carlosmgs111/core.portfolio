import fs from "fs";
import { TaskMessageService } from "../../config/dependencies";

export const generateImage = (data: any) => {
  const { prompt } = data;
  console.log({ prompt });
  TaskMessageService.sendMessage("generateImage", [prompt]);
  TaskMessageService.receiveMessage(
    "imageGenerated",
    async (message: any, options: any) => {
      console.log("Message received");
      const { title, format } = options;
      const decodedImage = Buffer.from(message, "base64");
      fs.writeFile(
        `datasets/images/${title}.${format}`,
        decodedImage,
        (err) => {
          if (err) throw err;
          console.log("La imagen fue guardada correctamente");
        }
      );
    }
  );
};
