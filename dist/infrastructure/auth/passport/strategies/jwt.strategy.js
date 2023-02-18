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
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const boom_1 = __importDefault(require("@hapi/boom"));
const config_1 = __importDefault(require("../../../../config"));
const CRUD_1 = require("../../../../users/application/CRUD");
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.default.jwtAccessSecret,
};
exports.JwtStrategy = new passport_jwt_1.Strategy(opts, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, } = payload;
    // console.log({ JwtStrategyEmail:email });
    try {
        const entity = yield (0, CRUD_1.findBy)("Account", { email });
        // console.log({ entity });
        if (entity) {
            return done(null, entity);
        }
        return done(boom_1.default.unauthorized(), false);
    }
    catch (e) {
        return done(e, false);
    }
}));
