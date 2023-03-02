import fs from "fs";
import { TaskMessageService } from "../../config/dependencies";

export const generateImage = async (data: any) => {
  const { prompt } = data;
  TaskMessageService.sendMessage("generateImage", [prompt]);
  const getImage = new Promise((resolve: any, reject: any) => {
    TaskMessageService.receiveMessage(
      "imageGenerated",
      async (image: any, options: any) => {
        resolve(image);
        console.log("image received");
        const { title, format } = options;
        const decodedImage = Buffer.from(image, "base64");
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
  });
  const response = await getImage
    .then((image) => image)
    .catch((e: any) => console.log(e.message.bgRed))
    .finally(() => console.log("Finished!".bgGreen));
  console.log({ response });
  return response;
};
