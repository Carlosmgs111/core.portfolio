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
exports.User = void 0;
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../../../utils");
const boom_1 = __importDefault(require("@hapi/boom"));
class User {
    constructor({ uuid, username, email, password, privilege, avatar, createdAt, updatedAt, }) {
        this.createdAt = 0;
        this.updatedAt = 0;
        this.remove = (RepositoryService) => __awaiter(this, void 0, void 0, function* () {
            return yield RepositoryService.removeOne(RepositoryService.entities.User, {
                credentials: { uuid: this.uuid },
            });
        });
        this.update = (RepositoryService, data) => __awaiter(this, void 0, void 0, function* () {
            this.updatedAt = new Date().getTime();
            return yield RepositoryService.updateOne(RepositoryService.entities.User, Object.assign({}, (0, utils_1.getEntityProperties)(Object.assign(Object.assign({}, this), data))), { credentials: { uuid: this.uuid } });
        });
        this.hashPassword = (password) => __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hash = yield bcrypt_1.default.hash(password || this.password, salt);
            this.password = hash;
            return hash;
        });
        this.comparePassword = (password) => __awaiter(this, void 0, void 0, function* () { return yield bcrypt_1.default.compare(password, this.password); });
        this.changePassword = (RepositoryService_1, _a) => __awaiter(this, [RepositoryService_1, _a], void 0, function* (RepositoryService, { newPassword, oldPassword }) {
            if (yield this.comparePassword(oldPassword)) {
                yield this.hashPassword(newPassword);
                yield this.update(RepositoryService, {});
                return true;
            }
            return false;
        });
        this.uuid = uuid;
        this.username = username;
        this.email = !email ? `${uuid}@${username}.email` : email;
        this.password = password;
        this.privilege = privilege;
        this.avatar = avatar;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.User = User;
_a = User;
User.create = (RepositoryService, data) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield RepositoryService.findOne(RepositoryService.entities.User, {
        credentials: (0, utils_1.filterAttrs)((0, utils_1.getEntityProperties)(data), ["email", "username"], false),
    });
    if (exist)
        throw boom_1.default.conflict("Entity exist yet!");
    const uuid = (0, uuid_1.v4)();
    const account = new _a(Object.assign(Object.assign({}, data), { uuid, privilege: "admin", createdAt: new Date().getTime(), updatedAt: new Date().getTime() }));
    yield account.hashPassword(account.password);
    const result = yield RepositoryService.createOne(RepositoryService.entities.User, Object.assign({}, (0, utils_1.getEntityProperties)(account)));
    return account;
});
User.load = (RepositoryService_1, ...args_1) => __awaiter(void 0, [RepositoryService_1, ...args_1], void 0, function* (RepositoryService, options = {}) {
    const user = yield _a.find(RepositoryService, options);
    if (!user)
        throw boom_1.default.notFound("Incorrect credentials!");
    const account = new _a(user);
    return account;
});
User.authLoad = (RepositoryService_2, ...args_2) => __awaiter(void 0, [RepositoryService_2, ...args_2], void 0, function* (RepositoryService, options = {}) {
    const user = yield _a.find(RepositoryService, options);
    if (!user)
        throw boom_1.default.notFound("Incorrect credentials!");
    if (!(yield _a.comparePassword(options.credentials.password, user.password)))
        throw boom_1.default.conflict("Password doesn't match!");
    const account = new _a(user);
    return account;
});
User.find = (RepositoryService_3, ...args_3) => __awaiter(void 0, [RepositoryService_3, ...args_3], void 0, function* (RepositoryService, options = {}) {
    const { credentials } = options;
    if (!credentials)
        throw boom_1.default.conflict("Indexation must be provided!");
    const account = yield RepositoryService.findOne(RepositoryService.entities.User, Object.assign(Object.assign({}, options), { credentials: (0, utils_1.filterAttrs)((0, utils_1.getEntityProperties)(credentials), ["email", "username", "uuid"], false) }));
    if (!account)
        throw boom_1.default.conflict("Account doesn´t exist!");
    return account;
});
User.findAll = (DatabaseService_1, ...args_4) => __awaiter(void 0, [DatabaseService_1, ...args_4], void 0, function* (DatabaseService, options = {}) {
    return (yield DatabaseService.findAll(DatabaseService.entities.User, options)).map((user) => (0, utils_1.filterAttrs)(user, ["privilege", "password"]));
});
User.certifications = (RepositoryService, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _a.find(RepositoryService, {
        credentials,
        related: [["Certification"]],
    });
    return user.Certifications.map((c) => (0, utils_1.filterAttrs)(Object.assign(Object.assign({}, (c.dataValues ? c.dataValues : c._doc)), { grantedTo: user.username }), ["Users_Certifications"]));
});
User.projects = (RepositoryService, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _a.find(RepositoryService, {
        credentials,
        related: [["Project"]],
    });
    return user.Projects;
});
User.comparePassword = (loaded, provided) => __awaiter(void 0, void 0, void 0, function* () { return yield bcrypt_1.default.compare(loaded, provided); });
