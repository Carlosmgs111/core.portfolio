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
exports.resetPassword = exports.update = exports.unsubscribe = exports.authSignin = exports.signin = exports.signup = void 0;
const User_1 = require("../../domain/entities/User");
const dependencies_1 = require("../../config/dependencies");
const utils_1 = require("../../domain/utils");
const config_1 = __importDefault(require("../../config"));
const signup = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.User.create(dependencies_1.DatabaseService, credentials);
});
exports.signup = signup;
const signin = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield User_1.User.load(dependencies_1.DatabaseService, {
        credentials,
    });
    if (!account)
        throw new Error("The account doesn't exist!");
    let response = dependencies_1.AuthServices.getAuthPackage((0, utils_1.filterAttrs)(account, ["uuid", "email", "username"], false));
    return response;
});
exports.signin = signin;
const authSignin = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    dependencies_1.DatabaseService;
    const entity = yield User_1.User.load(dependencies_1.DatabaseService, credentials);
    // console.log({ entity });
    if (!entity)
        throw new Error("The account doesn't exist!");
    const isMatch = entity.comparePassword(credentials.password);
    if (!isMatch)
        throw new Error("The account doesn't exist!");
    return entity;
});
exports.authSignin = authSignin;
const unsubscribe = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    dependencies_1.DatabaseService;
    const account = yield User_1.User.load(dependencies_1.DatabaseService, credentials);
    if (account)
        yield account.remove(dependencies_1.DatabaseService);
});
exports.unsubscribe = unsubscribe;
const update = (credentials, data) => __awaiter(void 0, void 0, void 0, function* () {
    dependencies_1.DatabaseService;
    const account = yield User_1.User.load(dependencies_1.DatabaseService, credentials);
    if (account)
        yield account.update(dependencies_1.DatabaseService, data);
});
exports.update = update;
// ! possible vulnerability detected!
const resetPassword = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    dependencies_1.DatabaseService;
    const { token } = credentials;
    console.log({ token });
    const { email, cipheredPassword } = dependencies_1.AuthServices.verifyKey(token);
    const newPassword = (0, utils_1.decryptData)(cipheredPassword, config_1.default.jwtSignupSecret);
    const account = yield User_1.User.load(dependencies_1.DatabaseService, { email });
    const oldPassword = account.password;
    // account.changePassword({ newPassword, oldPassword }); // ! check this method
});
exports.resetPassword = resetPassword;
