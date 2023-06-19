"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expiresIn1Month = exports.expiresIn2H = exports.expiresIn15Minutes = exports.D = exports.H = exports.M = exports.S = void 0;
const config_1 = __importDefault(require("../../config"));
exports.S = 1; // seconds
exports.M = 60 * exports.S; // minutes
exports.H = 60 * exports.M; // hours
exports.D = 24 * exports.H; // days
exports.expiresIn15Minutes = exports.M * 15;
exports.expiresIn2H = config_1.default.jwtExp || exports.H * 2;
exports.expiresIn1Month = exports.D * 30;
