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
exports.User_Institution = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../../utils");
const boom_1 = __importDefault(require("@hapi/boom"));
class User_Institution {
    constructor({ uuid, userUUID, institutionUUID, }) {
        this.remove = (DatabaseServices) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupEntity("Users_Institutions");
            return yield DatabaseServices.remove((0, utils_1.getEntityProperties)(this));
        });
        this.update = (DatabaseServices, data) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupEntity("Users_Institutions");
            return yield DatabaseServices.update(Object.assign({}, (0, utils_1.getEntityProperties)(Object.assign(Object.assign({}, this), data))), { credentials: { uuid: this.uuid } });
        });
        this.uuid = uuid;
        this.userUUID = userUUID;
        this.institutionUUID = institutionUUID;
    }
}
exports.User_Institution = User_Institution;
_a = User_Institution;
User_Institution.create = (DatabaseServices, data) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupEntity("Users_Institutions");
    const exist = yield DatabaseServices.findOne(Object.assign({}, (0, utils_1.filterAttrs)(data, ["institutionUUID", "userUUID"], false)));
    console.log({ UIExist: exist });
    if (exist)
        throw boom_1.default.conflict("Entity exist yet!");
    const uuid = (0, uuid_1.v4)();
    const userInstitution = new User_Institution(Object.assign(Object.assign({}, data), { uuid }));
    console.log({ userInstitution });
    yield DatabaseServices.create(userInstitution);
    return userInstitution;
});
User_Institution.load = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupEntity("Users_Institutions");
    const user = yield User_Institution.find(DatabaseServices, credentials);
    if (!user)
        throw boom_1.default.notFound("Incorrect credentials!");
    console.log({ user });
    const account = new User_Institution(user);
    return account;
});
User_Institution.find = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupEntity("Users_Institutions");
    const userInstitution = yield DatabaseServices.findOne({
        credentials,
    });
    console.log({ userInstitution });
    return userInstitution;
});
