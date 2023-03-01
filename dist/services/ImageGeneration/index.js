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
const generateImage = (data) => {
    const { prompt } = data;
    console.log({ prompt });
    dependencies_1.TaskMessageService.sendMessage("generateImage", [prompt]);
    dependencies_1.TaskMessageService.receiveMessage("imageGenerated", (message, options) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Message received");
        const { title, format } = options;
        const decodedImage = Buffer.from(message, "base64");
        fs_1.default.writeFile(`datasets/images/${title}.${format}`, decodedImage, (err) => {
            if (err)
                throw err;
            console.log("La imagen fue guardada correctamente");
        });
    }));
};
exports.generateImage = generateImage;
