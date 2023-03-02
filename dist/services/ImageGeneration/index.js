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
exports.generateImage = void 0;
const fs_1 = __importDefault(require("fs"));
const dependencies_1 = require("../../config/dependencies");
const generateImage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = data;
    dependencies_1.TaskMessageService.sendMessage("generateImage", [prompt]);
    const getImage = new Promise((resolve, reject) => {
        dependencies_1.TaskMessageService.receiveMessage("imageGenerated", (image, options) => __awaiter(void 0, void 0, void 0, function* () {
            resolve(image);
            console.log("image received");
            const { title, format } = options;
            const decodedImage = Buffer.from(image, "base64");
            fs_1.default.writeFile(`datasets/images/${title}.${format}`, decodedImage, (err) => {
                if (err)
                    throw err;
                console.log("La imagen fue guardada correctamente");
            });
        }));
    });
    const response = yield getImage
        .then((image) => image)
        .catch((e) => console.log(e.message.bgRed))
        .finally(() => console.log("Finished!".bgGreen));
    console.log({ response });
    return response;
});
exports.generateImage = generateImage;
