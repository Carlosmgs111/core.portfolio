import fs from "fs";
import { TaskMessageService, SocketService } from "../../config/dependencies";

export const generateImage = async (data: any, responseCb: any) => {
  const { prompt } = data;
  const getImage = new Promise((resolve: any, reject: any) => {
    console.log({ resolve });
    TaskMessageService.receiveMessage(
      "imageGenerated",
      async (image: any, options: any) => {
        try {
          console.log("image received".bgYellow);
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
          console.log("Resolving...".bgMagenta);
          if (responseCb) responseCb({ imageGenerated: image });
          resolve(image);
          console.log("Resolved.".bgWhite);
        } catch (error: any) {
          console.error(
            `Ocurrió un error al guardar la imagen: ${error}`.bgRed
          );
          reject(error);
        }
        return image;
      }
    );
  });
  TaskMessageService.sendMessage("generateImage", [prompt]);
  const response = await getImage
    .then((image: any) => {
      console.log(image?.slice(0, 100).bgMagenta);
      return image;
    })
    .catch((e: any) => console.log(e.message.bgRed))
    .finally(() => console.log("Finished!".bgGreen));
  console.log("Successed!".bgGreen);
  return response;
};

SocketService.addEvent({ generateImage });
