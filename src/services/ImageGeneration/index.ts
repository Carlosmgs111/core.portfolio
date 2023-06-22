import fs from "fs";
import { TaskMessageService, SocketService } from "../../config/dependencies";

export const generatedImages = async (images: any) => {};

export const generateImages = async (data: any) => {
  const { prompt, options = {} } = data;

  TaskMessageService.sendMessage(
    {
      generateImages: {
        generateImages: [
          prompt,
          ...Object.entries(options).flatMap((b) => b[1]),
        ],
      },
    }
    // imageGenerated
  );

  const getImage = new Promise((resolve: any, reject: any) => {
    TaskMessageService.receiveMessage({
      generatedImages: async (images: any) => {
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
          resolve(images);
          console.log("Resolved.".bgWhite);
        } catch (error: any) {
          console.error(
            `Ocurrió un error al guardar la imagen: ${error}`.bgRed
          );
          reject(error);
        }
        return images; // ? ⬅️ This return result to TaskMessageService
        return { generatedImages: images };
      },
    });
  });

  const response = await getImage
    .then((images: any) => {
      images?.slice(0, 100).bgMagenta;
      return images;
    })
    .catch((e: any) => e.message.bgRed)
    .finally(() => console.log("Finished!".bgGreen));
  console.log("Successed!".bgGreen);
  return response;
};

SocketService.addEvent({ generateImages });

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
