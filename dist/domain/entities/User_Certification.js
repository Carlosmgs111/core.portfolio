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
exports.User_Certification = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../../utils");
const boom_1 = __importDefault(require("@hapi/boom"));
class User_Certification {
    constructor({ uuid, userUUID, certificationUUID, }) {
        this.remove = (DatabaseServices) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupEntity("Users_Certifications");
            console.log({ credentials: (0, utils_1.getEntityProperties)(this) });
            return yield DatabaseServices.remove({
                credentials: (0, utils_1.getEntityProperties)(this),
            });
        });
        this.update = (DatabaseServices, data) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupEntity("Users_Certifications");
            return yield DatabaseServices.update(Object.assign({}, (0, utils_1.getEntityProperties)(Object.assign(Object.assign({}, this), data))), { credentials: { uuid: this.uuid } });
        });
        this.uuid = uuid;
        this.userUUID = userUUID;
        this.certificationUUID = certificationUUID;
    }
}
exports.User_Certification = User_Certification;
_a = User_Certification;
User_Certification.create = (DatabaseServices, data) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupEntity("Users_Certifications");
    const exist = yield DatabaseServices.findOne({
        credentials: (0, utils_1.filterAttrs)(data, ["certificationUUID", "userUUID"], false),
    });
    console.log({ UCExist: exist });
    if (exist)
        throw boom_1.default.conflict("Entity exist yet!");
    const uuid = (0, uuid_1.v4)();
    const userCertification = new User_Certification(Object.assign(Object.assign({}, data), { uuid }));
    console.log({ userCertification });
    yield DatabaseServices.setupEntity("Users_Certifications").create(userCertification);
    return userCertification;
});
User_Certification.load = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupEntity("Users_Certifications");
    const user = yield User_Certification.find(DatabaseServices, credentials);
    if (!user)
        throw boom_1.default.notFound("Incorrect credentials!");
    console.log({ user });
    const account = new User_Certification(user);
    return account;
});
User_Certification.find = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupEntity("Users_Certifications");
    const userCertification = yield DatabaseServices.findOne({
        credentials,
    });
    console.log({ userCertification });
    return userCertification;
});
User_Certification.findAll = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupEntity("Users_Certifications");
    console.log({ credentials });
    const userCertification = yield DatabaseServices.findAll({
        credentials,
        // model: "Certification",
    });
    return userCertification;
});
