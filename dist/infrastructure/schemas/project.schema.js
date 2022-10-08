"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const name = joi_1.default.string();
const descriptions = joi_1.default.string(); // ! change to type array of string
const images = joi_1.default.string(); // ! change to type array of string
const uri = joi_1.default.string();
exports.createUserSchema = joi_1.default.object({
    descriptions: descriptions.required(),
    name: name.required(),
    images: images.required(),
    uri,
});
exports.updateUserSchema = joi_1.default.object({
    descriptions,
    uri,
    images
});
exports.getUserSchema = joi_1.default.object({
    descriptions,
    name,
    images
});
