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
exports.verifyToken2 = exports.verifyToken = exports.createToken = void 0;
const config_1 = __importDefault(require("../../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const expires_1 = require("../expires");
const jose_1 = require("jose");
const use_cases_1 = require("../../../modules/users/use_cases");
const createToken = (params, expiresIn = expires_1.expiresIn1Month, secret = config_1.default.jwtAccessSecret) => {
    return jsonwebtoken_1.default.sign(Object.assign({ sub: params._id || params.sub }, params), secret || "", {
        expiresIn,
    });
};
exports.createToken = createToken;
const verifyToken = (token, signature = config_1.default.jwtSignupSecret) => {
    console.log({ signature });
    try {
        const payload = jsonwebtoken_1.default.verify(token, signature);
        console.log({ payload });
        if (!payload)
            throw new Error("Invalid Payload!");
        return payload;
    }
    catch (e) {
        console.log(e);
        throw new Error("Invalid Token!");
    }
};
exports.verifyToken = verifyToken;
const verifyToken2 = (token, signature = config_1.default.jwtAccessSecret) => __awaiter(void 0, void 0, void 0, function* () {
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
        console.log({ ERROR: e.message });
        console.log("Invalid Token!");
        throw new Error("Invalid token");
    }
});
exports.verifyToken2 = verifyToken2;
