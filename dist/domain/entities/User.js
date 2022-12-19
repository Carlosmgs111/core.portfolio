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
const utils_1 = require("../../utils");
const boom_1 = __importDefault(require("@hapi/boom"));
class User {
    constructor({ uuid, username, email, password, privilege, createdAt, updatedAt, }) {
        this.createdAt = 0;
        this.updatedAt = 0;
        this.remove = (DatabaseServices) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupModel("User");
            return yield DatabaseServices.remove((0, utils_1.getEntityProperties)(this));
        });
        this.update = (DatabaseServices, data) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupModel("User");
            this.updatedAt = new Date().getTime();
            return yield DatabaseServices.update(Object.assign({}, (0, utils_1.getEntityProperties)(Object.assign(Object.assign({}, this), data))));
        });
        this.hashPassword = (password) => __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hash = yield bcrypt_1.default.hash(password || this.password, salt);
            this.password = hash;
            return hash;
        });
        this.comparePassword = (password) => __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, this.password);
        });
        this.uuid = uuid;
        this.username = username;
        this.email = email;
        this.password = password;
        this.privilege = privilege;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.User = User;
_a = User;
User.create = (DatabaseServices, data) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("User");
    const exist = yield DatabaseServices.findOne(Object.assign({}, (0, utils_1.filterAttrs)(data, ["email", "username"], false)));
    if (exist)
        throw boom_1.default.conflict("Entity exist yet!");
    const uuid = (0, uuid_1.v4)();
    const account = new User(Object.assign(Object.assign({}, data), { uuid, privilege: "admin", createdAt: new Date().getTime(), updatedAt: new Date().getTime() }));
    yield account.hashPassword(account.password);
    yield DatabaseServices.create(Object.assign({}, (0, utils_1.getEntityProperties)(account)));
    return account;
});
User.load = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("User");
    const user = yield User.find(DatabaseServices, (0, utils_1.filterAttrs)(credentials, ["email", "username"], false));
    if (!user)
        throw boom_1.default.notFound("Incorrect credentials!");
    const account = new User(user);
    return account;
});
User.find = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("User");
    const account = yield DatabaseServices.findOne(Object.assign({}, (0, utils_1.filterAttrs)((0, utils_1.getEntityProperties)(credentials), ["email", "username"], false)));
    return account;
});
User.certifications = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("User").setInclude([["Certification"]]);
    const user = yield User.find(DatabaseServices, credentials);
    return user.Certifications.map((c) => (Object.assign(Object.assign({}, c.dataValues), { grantedTo: user.username })));
});
User.projects = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("User").setInclude([["Project"]]);
    const user = yield User.find(DatabaseServices, credentials);
    return DatabaseServices.hasMany(user, "Projects");
});
