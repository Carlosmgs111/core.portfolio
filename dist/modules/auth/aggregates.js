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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const entity_1 = require("../users/entity");
const boom_1 = __importDefault(require("@hapi/boom"));
class Auth {
    constructor() { }
}
exports.Auth = Auth;
_a = Auth;
Auth.authenticate = (RepositoryService, options) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield entity_1.User.find(RepositoryService, options);
    if (!user)
        throw boom_1.default.notFound("Incorrect credentials!");
    if (!(yield entity_1.User.comparePassword(options.credentials.password, user.password)))
        throw boom_1.default.conflict("Password doesn't match!");
    const account = new entity_1.User(user);
    return account;
});
