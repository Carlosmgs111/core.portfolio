"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCertifications = exports.updateCertification = exports.createCertification = void 0;
const joi_1 = __importDefault(require("joi"));
const title = joi_1.default.string();
const emitedBy = joi_1.default.string(); // ! change to type array of string
const emitedAt = joi_1.default.number(); // ! change to type array of string
const image = joi_1.default.string();
const url = joi_1.default.string();
const uuid = joi_1.default.string();
exports.createCertification = joi_1.default.object({
    title: title.required(),
    emitedBy: emitedBy.required(),
    emitedAt: emitedAt.required(),
    image: image.required(),
    url,
});
exports.updateCertification = joi_1.default.object({
    uuid,
    emitedAt,
    title: title.required(),
    image: image.required(),
    url,
});
exports.createCertifications = joi_1.default.array().items(exports.createCertification);
