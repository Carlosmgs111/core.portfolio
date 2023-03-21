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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.update = exports.createOne = exports.findBy = exports.updateAvatar = exports.changeUsername = exports.load = exports.getAllUsername = exports.sayHello = exports.updateUser = exports.removeUser = exports.registerUser = void 0;
const entity_1 = require("./entity");
const dependencies_1 = require("../../config/dependencies");
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield entity_1.User.create(dependencies_1.RepositoryService, data);
});
exports.registerUser = registerUser;
const removeUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield entity_1.User.authLoad(dependencies_1.RepositoryService, data);
    ({ user });
    return yield user.remove(dependencies_1.RepositoryService);
});
exports.removeUser = removeUser;
const updateUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    ({ data });
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
    ({ user, newUsername });
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
    // ({ findBy });
    return yield entities[label].find(dependencies_1.RepositoryService, { credentials: findBy });
});
exports.findBy = findBy;
const createOne = (label, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield entities[label].new(dependencies_1.RepositoryService, args);
});
exports.createOne = createOne;
/*  */
const update = (credentials, data) => __awaiter(void 0, void 0, void 0, function* () {
    dependencies_1.RepositoryService;
    const account = yield entity_1.User.authLoad(dependencies_1.RepositoryService, credentials);
    if (account)
        yield account.update(dependencies_1.RepositoryService, data);
});
exports.update = update;
const resetPassword = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword, username, token, user } = credentials;
    ({ user });
    const result = yield user.changePassword(dependencies_1.RepositoryService, {
        newPassword,
        oldPassword,
    });
    return { changed: result };
});
exports.resetPassword = resetPassword;
