"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const config_1 = __importDefault(require("../../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const expires_1 = require("../expires");
const createToken = (params, expiresIn = expires_1.expiresIn1Month, secret = config_1.default.jwtAccessSecret) => {
    return jsonwebtoken_1.default.sign(Object.assign({ sub: params._id || params.sub }, params), secret, {
        expiresIn,
    });
};
exports.createToken = createToken;
const verifyToken = (token, signature = config_1.default.jwtSignupSecret) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, signature);
        if (!payload)
            throw new Error("Invalid Payload!");
        return payload;
    }
    catch (e) {
        throw new Error("Invalid Token!");
    }
};
exports.verifyToken = verifyToken;
