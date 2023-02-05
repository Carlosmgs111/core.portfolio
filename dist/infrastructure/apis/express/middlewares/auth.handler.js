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
exports.authMiddleware = exports.checkRoles = exports.checkAdminRole = exports.checkApiKey = exports.verifyToken = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
const config_1 = __importDefault(require("../../../../config"));
const jose_1 = require("jose");
const users_1 = require("../../../../application/use_cases/users");
const verifyToken = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    const token = (authorization || "").replace("Bearer ", "");
    console.log({ decoded: (0, jose_1.decodeJwt)(token) });
    try {
        const verified = yield (0, jose_1.jwtVerify)(token, new TextEncoder().encode(config_1.default.jwtAccessSecret));
        //console.log({verified})
        return verified.payload;
    }
    catch (e) {
        console.log("Invalid Token!");
        throw new Error("Invalid token");
    }
});
exports.verifyToken = verifyToken;
// * for check api-key and verify its privilege
function checkApiKey(req, res, next) {
    const apiKey = req.headers["api-key"];
    console.log({ apiKey });
    if (apiKey === config_1.default.apiKey) {
        next();
    }
    else {
        next(boom_1.default.unauthorized());
    }
}
exports.checkApiKey = checkApiKey;
// ! deprecated
function checkAdminRole(req, res, next) {
    const user = req.user;
    if (user.role === "admin") {
        next();
    }
    else {
        next(boom_1.default.unauthorized());
    }
}
exports.checkAdminRole = checkAdminRole;
// * Closure function that return a express handler
function checkRoles(...roles) {
    return (req, res, next) => {
        const user = req.user;
        if (roles.includes(user.privilege || user.role)) {
            next();
        }
        else {
            next(boom_1.default.unauthorized());
        }
    };
}
exports.checkRoles = checkRoles;
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = yield (0, exports.verifyToken)(req);
            console.log({ payload });
            req.user = yield (0, users_1.load)({
                uuid: payload.uuid,
                email: payload.email,
            });
        }
        catch (e) {
            console.log({ e });
            next(boom_1.default.unauthorized());
        }
        finally {
            next();
        }
    });
}
exports.authMiddleware = authMiddleware;
