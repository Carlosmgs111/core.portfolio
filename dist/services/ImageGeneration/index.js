"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabelSettings = exports.modifyImages = exports.generateImage = void 0;
const fs_1 = __importDefault(require("fs"));
const dependencies_1 = require("../../config/dependencies");
const generateImage = (data, responseCb) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt, options = {} } = data;
    const getImage = new Promise((resolve, reject) => {
        dependencies_1.TaskMessageService.receiveMessage("imageGenerated", (images) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("images received".bgYellow);
            try {
                for (let image of images) {
                    const { encoded_image, img_title, img_format } = image;
                    const decodedImage = Buffer.from(encoded_image, "base64");
                    fs_1.default.writeFile(`datasets/images/${img_title}.${img_format}`, decodedImage, (err) => {
                        if (err)
                            throw err;
                        console.log("La imagen fue guardada correctamente");
                    });
                }
                console.log("Resolving...".bgMagenta);
                // if (responseCb) responseCb(images); // ? ⬅️ This pass result to callback provided by SocketService
                resolve(images);
                console.log("Resolved.".bgWhite);
            }
            catch (error) {
                console.error(`Ocurrió un error al guardar la imagen: ${error}`.bgRed);
                reject(error);
            }
            return { generatedImages: images }; // ? ⬅️ This return result to TaskMessageService
        }));
    });
    dependencies_1.TaskMessageService.sendMessage("generateImage", [
        prompt,
        ...Object.entries(options).flatMap((b) => b[1]),
    ]);
    const response = yield getImage
        .then((images) => {
        images === null || images === void 0 ? void 0 : images.slice(0, 100).bgMagenta;
        return images;
    })
        .catch((e) => e.message.bgRed)
        .finally(() => console.log("Finished!".bgGreen));
    console.log("Successed!".bgGreen);
    if (responseCb)
        responseCb(response); // ? ⬅️ This pass result to callback provided by SocketService
    return response;
});
exports.generateImage = generateImage;
const modifyImages = (data) => {
    const { images } = data;
    ({ images });
};
exports.modifyImages = modifyImages;
const availabelSettings = () => ({
    outputs: [1, 4],
    sizes: [128, 256, 512, 768, 1024],
    inferenceSteps: { min: 1, max: 500 },
    guidanceScale: { min: 1, max: 20 },
});
exports.availabelSettings = availabelSettings;
dependencies_1.SocketService.addEvent({ generateImage: exports.generateImage });
