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
exports.resetAuthPassword = exports.signin = exports.authSignin = exports.unsubscribe = exports.signup = exports.login = void 0;
const entity_1 = require("../../users/entity");
const dependencies_1 = require("../../../config/dependencies");
const utils_1 = require("../../../utils");
const config_1 = __importDefault(require("../../../config"));
const boom_1 = __importDefault(require("@hapi/boom"));
const login = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield entity_1.User.authLoad(dependencies_1.RepositoryService, {
        credentials,
        // related: [["Institution"], ["Certification"]],
    });
    if (!account)
        throw new Error("The account doesn't exist!");
    let response = dependencies_1.AuthServices.getAuthPackage(Object.assign(Object.assign({}, (0, utils_1.filterAttrs)(account, ["uuid", "email", "username", "privilege", "createdAt", "avatar"], false)), { apiKey: config_1.default.apiKey }));
    return response;
});
exports.login = login;
const signup = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = credentials;
    if (email) {
        console.log("Authentication Signup use case must be implemented! ".bgYellow);
    }
    return yield entity_1.User.create(dependencies_1.RepositoryService, credentials);
});
exports.signup = signup;
const unsubscribe = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    dependencies_1.RepositoryService;
    const account = yield entity_1.User.authLoad(dependencies_1.RepositoryService, credentials);
    if (account)
        yield account.remove(dependencies_1.RepositoryService);
});
exports.unsubscribe = unsubscribe;
const authSignin = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    dependencies_1.RepositoryService;
    const entity = yield entity_1.User.authLoad(dependencies_1.RepositoryService, credentials);
    if (!entity)
        throw new Error("The account doesn't exist!");
    const isMatch = entity.comparePassword(credentials.password);
    if (!isMatch)
        throw new Error("The account doesn't exist!");
    return entity;
});
exports.authSignin = authSignin;
const signin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(new Map(Object.entries(data)).has("email") ||
        new Map(Object.entries(data)).has("username")))
        throw boom_1.default.badRequest("Require username or email!");
    return yield entity_1.User.authLoad(dependencies_1.RepositoryService, { credentials: data });
});
exports.signin = signin;
// ! possible vulnerability detected!
const resetAuthPassword = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    dependencies_1.RepositoryService;
    const { token } = credentials;
    ({ token });
    const { email, cipheredPassword } = dependencies_1.AuthServices.verifyKey(token);
    const newPassword = (0, utils_1.decryptData)(cipheredPassword, config_1.default.jwtSignupSecret || "");
    const account = yield entity_1.User.authLoad(dependencies_1.RepositoryService, {
        credentials: { email },
    });
    const oldPassword = account.password;
    account.changePassword(dependencies_1.RepositoryService, { newPassword, oldPassword }); // ! check this method
    return "OK";
});
exports.resetAuthPassword = resetAuthPassword;
