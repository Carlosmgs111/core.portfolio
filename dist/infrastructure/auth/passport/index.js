"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuthenticate = exports.localAuthenticate = void 0;
const passport_1 = __importDefault(require("passport"));
const local_strategy_1 = require("./strategies/local.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
passport_1.default.use(local_strategy_1.LocalStrategy);
passport_1.default.use(jwt_strategy_1.JwtStrategy);
exports.localAuthenticate = passport_1.default.authenticate("local", {
    session: false
});
exports.jwtAuthenticate = passport_1.default.authenticate("jwt", { session: false });
exports.default = passport_1.default.initialize();
