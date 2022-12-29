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
exports.getAllUsername = exports.sayHello = exports.updateUser = exports.removeUser = exports.signin = exports.registerUser = void 0;
const User_1 = require("../../domain/entities/User");
const dependencies_1 = require("../../config/dependencies");
// ! implementar el uso de ´boom´ a traves de un ´interface´
const boom_1 = __importDefault(require("@hapi/boom"));
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.User.create(dependencies_1.DatabaseService, data);
});
exports.registerUser = registerUser;
const signin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(new Map(Object.entries(data)).has("email") ||
        new Map(Object.entries(data)).has("username")))
        throw boom_1.default.badRequest("Require username or email!");
    return yield User_1.User.load(dependencies_1.DatabaseService, { credentials: data });
});
exports.signin = signin;
const removeUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.load(dependencies_1.DatabaseService, data);
    console.log({ user });
    return yield user.remove(dependencies_1.DatabaseService);
});
exports.removeUser = removeUser;
const updateUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ data });
    return yield (yield User_1.User.load(dependencies_1.DatabaseService, data)).update(dependencies_1.DatabaseService, data);
});
exports.updateUser = updateUser;
const sayHello = (data) => data.user.sayHello(data.name);
exports.sayHello = sayHello;
const getAllUsername = () => __awaiter(void 0, void 0, void 0, function* () { return yield User_1.User.findAll(dependencies_1.DatabaseService); });
exports.getAllUsername = getAllUsername;
