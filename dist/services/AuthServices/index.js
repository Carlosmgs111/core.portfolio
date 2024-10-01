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
exports.AuthServices = exports.extractFromToken = exports.verifyToken2 = exports.verifyToken = exports.createToken = void 0;
// import { createToken, verifyToken2 } from "../../infrastructure/auth/JWT";
const expires_1 = require("./expires");
const config_1 = __importDefault(require("../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jose_1 = require("jose");
const use_cases_1 = require("../../modules/shared/auth/application/use_cases");
const createToken = (params, expiresIn = expires_1.expiresIn1Month, secret = config_1.default.jwtAccessSecret) => {
    return jsonwebtoken_1.default.sign(Object.assign({ sub: params._id || params.sub }, params), secret || "", {
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
        e;
        throw new Error("Invalid Token!");
    }
};
exports.verifyToken = verifyToken;
const verifyToken2 = (token_1, ...args_1) => __awaiter(void 0, [token_1, ...args_1], void 0, function* (token, signature = config_1.default.jwtAccessSecret) {
    try {
        const verified = yield (0, jose_1.jwtVerify)(token, new TextEncoder().encode(signature));
        const { uuid, email, username } = verified.payload;
        console.log({ uuid, email, username });
        return {
            user: yield (0, use_cases_1.signin)({
                uuid,
                email,
                username,
            }),
        };
    }
    catch (e) {
        throw new Error("Invalid token");
    }
});
exports.verifyToken2 = verifyToken2;
const extractFromToken = (token_1, ...args_1) => __awaiter(void 0, [token_1, ...args_1], void 0, function* (token, signature = config_1.default.jwtAccessSecret) {
    return (yield (0, jose_1.jwtVerify)(token, new TextEncoder().encode(signature))).payload;
});
exports.extractFromToken = extractFromToken;
class AuthServices {
    constructor() {
        this.createShortTimeKey = (payload) => {
            return (0, exports.createToken)(payload, expires_1.expiresIn15Minutes, config_1.default.jwtSignupSecret);
        };
        this.verifyKey = (key) => {
            return (0, exports.verifyToken2)(key);
        };
        this.getAuthPackage = (params) => {
            const token = (0, exports.createToken)(params, expires_1.expiresIn2H);
            return {
                token,
                apiKey: config_1.default.apiKey,
            };
        };
        this.extractFromToken = exports.extractFromToken;
    }
}
exports.AuthServices = AuthServices;
