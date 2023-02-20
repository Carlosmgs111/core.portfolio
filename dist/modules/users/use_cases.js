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
exports.resetPassword = exports.resetAuthPassword = exports.update = exports.unsubscribe = exports.authSignin = exports.login = exports.signup = exports.createOne = exports.findBy = exports.updateAvatar = exports.changeUsername = exports.load = exports.getAllUsername = exports.sayHello = exports.updateUser = exports.removeUser = exports.signin = exports.registerUser = void 0;
const entity_1 = require("./entity");
const dependencies_1 = require("../../config/dependencies");
const utils_1 = require("../../utils");
const config_1 = __importDefault(require("../../config"));
// ! implementar el uso de ´boom´ a traves de un ´interface´
const boom_1 = __importDefault(require("@hapi/boom"));
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield entity_1.User.create(dependencies_1.RepositoryService, data);
});
exports.registerUser = registerUser;
const signin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(new Map(Object.entries(data)).has("email") ||
        new Map(Object.entries(data)).has("username")))
        throw boom_1.default.badRequest("Require username or email!");
    return yield entity_1.User.authLoad(dependencies_1.RepositoryService, { credentials: data });
});
exports.signin = signin;
const removeUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield entity_1.User.authLoad(dependencies_1.RepositoryService, data);
    console.log({ user });
    return yield user.remove(dependencies_1.RepositoryService);
});
exports.removeUser = removeUser;
const updateUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ data });
    return yield (yield entity_1.User.authLoad(dependencies_1.RepositoryService, data)).update(dependencies_1.RepositoryService, data);
});
exports.updateUser = updateUser;
const sayHello = (data) => data.user.sayHello(data.name);
exports.sayHello = sayHello;
const getAllUsername = () => __awaiter(void 0, void 0, void 0, function* () { return (yield entity_1.User.findAll(dependencies_1.RepositoryService)).map((u) => u.username); });
exports.getAllUsername = getAllUsername;
const load = (credentials) => __awaiter(void 0, void 0, void 0, function* () { return yield entity_1.User.load(dependencies_1.RepositoryService, { credentials }); });
exports.load = load;
const changeUsername = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, newUsername } = credentials;
    console.log({ user, newUsername });
    yield user.update(dependencies_1.RepositoryService, { username: newUsername });
});
exports.changeUsername = changeUsername;
const updateAvatar = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const { newAvatar, user } = credentials;
    yield user.update(dependencies_1.RepositoryService, { avatar: newAvatar });
});
exports.updateAvatar = updateAvatar;
/*  */
const entities = { User: entity_1.User };
const findBy = (label, findBy) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log({ findBy });
    return yield entities[label].find(dependencies_1.RepositoryService, { credentials: findBy });
});
exports.findBy = findBy;
const createOne = (label, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield entities[label].new(dependencies_1.RepositoryService, args);
});
exports.createOne = createOne;
const signup = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = credentials;
    if (email)
        console.log("Authentication Signup use case must be implemented! ".bgYellow);
    return yield entity_1.User.create(dependencies_1.RepositoryService, credentials);
});
exports.signup = signup;
// * this is the exposed to routes
const login = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield entity_1.User.authLoad(dependencies_1.RepositoryService, {
        credentials,
        // related: [["Institution"], ["Certification"]],
    });
    if (!account)
        throw new Error("The account doesn't exist!");
    let response = dependencies_1.AuthServices.getAuthPackage((0, utils_1.filterAttrs)(account, ["uuid", "email", "username", "privilege", "createdAt", "avatar"], false));
    return response;
});
exports.login = login;
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
const unsubscribe = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    dependencies_1.RepositoryService;
    const account = yield entity_1.User.authLoad(dependencies_1.RepositoryService, credentials);
    if (account)
        yield account.remove(dependencies_1.RepositoryService);
});
exports.unsubscribe = unsubscribe;
const update = (credentials, data) => __awaiter(void 0, void 0, void 0, function* () {
    dependencies_1.RepositoryService;
    const account = yield entity_1.User.authLoad(dependencies_1.RepositoryService, credentials);
    if (account)
        yield account.update(dependencies_1.RepositoryService, data);
});
exports.update = update;
// ! possible vulnerability detected!
const resetAuthPassword = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    dependencies_1.RepositoryService;
    const { token } = credentials;
    console.log({ token });
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
const resetPassword = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword, username, token, user } = credentials;
    console.log({ user });
    const result = yield user.changePassword(dependencies_1.RepositoryService, {
        newPassword,
        oldPassword,
    });
    return { changed: result };
});
exports.resetPassword = resetPassword;
