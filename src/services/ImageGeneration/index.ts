import fs from "fs";
import { TaskMessageService, SocketService } from "../../config/dependencies";

export const generateImage = async (data: any, responseCb: any) => {
  const { prompt, options = {} } = data;
  const getImage = new Promise((resolve: any, reject: any) => {
    TaskMessageService.receiveMessage("imageGenerated", async (images: any) => {
      console.log("images received".bgYellow);
      try {
        for (let image of images) {
          const { encoded_image, img_title, img_format } = image;
          const decodedImage = Buffer.from(encoded_image, "base64");
          fs.writeFile(
            `datasets/images/${img_title}.${img_format}`,
            decodedImage,
            (err) => {
              if (err) throw err;
              console.log("La imagen fue guardada correctamente");
            }
          );
        }
        console.log("Resolving...".bgMagenta);
        // ? ⬇️ Important! always return a object, which unique key is the name of returning connection and its value is the result of function
        // if (responseCb) responseCb({ generatedImages: images }); // ? ⬅️ This pass result to callback provided by SocketService
        resolve(images);
        console.log("Resolved.".bgWhite);
      } catch (error: any) {
        console.error(`Ocurrió un error al guardar la imagen: ${error}`.bgRed);
        reject(error);
      }
      return { generatedImages: images }; // ? ⬅️ This return result to TaskMessageService
    });
  });

  TaskMessageService.sendMessage("generateImage", [
    prompt,
    ...Object.entries(options).flatMap((b) => b[1]),
  ]);

  const response = await getImage
    .then((images: any) => {
      images?.slice(0, 100).bgMagenta;
      return images;
    })
    .catch((e: any) => e.message.bgRed)
    .finally(() => "Finished!".bgGreen);
  "Successed!".bgGreen;
  // ? ⬇️ Important! always return a object, which unique key is the name of returning connection and its value is the result of function
  if (responseCb) responseCb({ generatedImages: response })
  return response;
};

export const modifyImages = (data: any) => {
  const { images } = data;
  ({ images });
};

export const availabelSettings = () => ({
  outputs: [1, 4],
  sizes: [128, 256, 512, 768, 1024],
  inferenceSteps: { min: 1, max: 500 },
  guidanceScale: { min: 1, max: 20 },
});

SocketService.addEvent({ generateImage });
