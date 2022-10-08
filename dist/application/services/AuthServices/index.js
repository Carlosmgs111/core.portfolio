"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const JWT_1 = require("../../../infrastructure/auth/JWT");
const expires_1 = require("../../../infrastructure/auth/expires");
const config_1 = __importDefault(require("../../../config"));
class AuthServices {
    constructor() {
        this.createShortTimeKey = (payload) => {
            return (0, JWT_1.createToken)(payload, expires_1.fifteenMinutes, config_1.default.jwtSignupSecret);
        };
        this.verifyKey = (key) => {
            return (0, JWT_1.verifyToken)(key, config_1.default.jwtSignupSecret);
        };
        this.getAuthPackage = (params) => {
            const token = (0, JWT_1.createToken)(params, expires_1.expiresIn1Month);
            console.log({ token });
            return {
                token,
                expire: expires_1.expiresIn1Month,
                apiKey: config_1.default.apiKey,
            };
        };
    }
}
exports.AuthServices = AuthServices;
