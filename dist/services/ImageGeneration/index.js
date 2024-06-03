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
exports.availabelSettings = exports.modifyImages = exports.generateImages = exports.generatedImages = void 0;
const fs_1 = __importDefault(require("fs"));
const dependencies_1 = require("../../config/dependencies");
const generatedImages = (images) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let image of images) {
            const { encoded_image, img_title, img_format } = image;
            const decodedImage = Buffer.from(encoded_image, "base64");
            const imagesDirectory = "datasets/images/";
            if (!fs_1.default.existsSync(imagesDirectory)) {
                fs_1.default.mkdirSync(imagesDirectory, { recursive: true });
                console.log("Directory created successfully.");
            }
            fs_1.default.writeFile(`${imagesDirectory}${img_title}.${img_format}`, decodedImage, (err) => {
                if (err)
                    throw err;
                console.log("La imagen fue guardada correctamente");
            });
        }
    }
    catch (error) {
        console.error(`Ocurrió un error al guardar la imagen: ${error}`.bgRed);
        throw new Error(error.message);
    }
    return images;
});
exports.generatedImages = generatedImages;
const generateImages = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt, options = {} } = data;
    const imagesGenerated = yield dependencies_1.SocketService.sendMessage({
        imageService: {
            generate_images: [
                prompt,
                ...Object.entries(options).flatMap((b) => b[1]),
            ],
        },
    }, { generatedImages: exports.generatedImages });
    return imagesGenerated;
});
exports.generateImages = generateImages;
dependencies_1.SocketService.addEvent({ generateImages: exports.generateImages });
const modifyImages = (data) => {
    const { images } = data;
};
exports.modifyImages = modifyImages;
const availabelSettings = () => ({
    outputs: [1, 4],
    sizes: [128, 256, 512, 768, 1024],
    inferenceSteps: { min: 1, max: 500 },
    guidanceScale: { min: 1, max: 20 },
});
exports.availabelSettings = availabelSettings;
