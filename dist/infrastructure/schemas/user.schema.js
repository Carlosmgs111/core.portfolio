"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const username = joi_1.default.string();
const email = joi_1.default.string().email();
const password = joi_1.default.string();
const privilege = joi_1.default.string();
exports.createUserSchema = joi_1.default.object({
    email,
    username: username.required(),
    password: password.required(),
    privilege,
});
exports.updateUserSchema = joi_1.default.object({
    email,
    privilege,
    password: password.required(),
});
exports.getUserSchema = joi_1.default.object({
    email,
    username,
    password: password.required(),
});
