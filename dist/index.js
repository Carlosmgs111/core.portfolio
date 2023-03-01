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
require("colors");
const index_1 = __importDefault(require("./infrastructure/apis/express/index"));
const terminal_1 = __importDefault(require("./infrastructure/apis/terminal"));
const dependencies_1 = require("./config/dependencies");
const fs_1 = __importDefault(require("fs"));
dependencies_1.TaskMessageService.sendMessage("generateImage", "Generate Image");
dependencies_1.TaskMessageService.receiveMessage("imageGenerated", (message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Message received");
    const decodedImage = Buffer.from(message, "base64");
    fs_1.default.writeFile("datasets/images/image.png", decodedImage, (err) => {
        if (err)
            throw err;
        console.log("La imagen fue guardada correctamente");
    });
}));
dependencies_1.RepositoryService.info();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, index_1.default)();
    yield (0, terminal_1.default)();
}))();
