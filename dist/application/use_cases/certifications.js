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
exports.removeCertification = exports.updateCertification = exports.addManyCertifications = exports.addNewCertification = exports.getCertificationByUUID = exports.getOwnCertifications = exports.getCertificationsByUsername = exports.getCertifications = void 0;
const dependencies_1 = require("../../config/dependencies");
const Certification_1 = require("../../domain/entities/Certification");
const Institution_1 = require("../../domain/entities/Institution");
const User_1 = require("../../domain/entities/User");
const User_Certification_1 = require("../../domain/entities/User_Certification");
const boom_1 = __importDefault(require("@hapi/boom"));
const utils_1 = require("../../utils");
const getCertifications = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, user, size, page } = data;
    const certifications = username
        ? yield User_1.User.certifications(dependencies_1.DatabaseService, {
            username,
        })
        : (yield Certification_1.Certification.findAll(dependencies_1.DatabaseService.setInclude([["User", ["username"]]]).setOptions({
            limit: size,
            offset: page,
        }), data)).map((c) => (Object.assign(Object.assign({}, c.dataValues), { grantedTo: c.Users[0].username })));
    const institutions = (yield Institution_1.Institution.findAll(dependencies_1.DatabaseService, {})).map((institution) => institution.dataValues);
    return certifications
        .map((certification) => {
        var _a;
        return (Object.assign(Object.assign({}, (0, utils_1.filterAttrs)(certification, ["Users", "Users_Certifications"])), { emitedAt: new Date(certification.emitedAt).getTime(), emitedBy: (_a = institutions.find((i) => i.uuid === certification.institutionUUID)) === null || _a === void 0 ? void 0 : _a.name }));
    })
        .sort((a, b) => {
        if (a.emitedAt < b.emitedAt)
            return 1;
        return -1;
    });
});
exports.getCertifications = getCertifications;
const getCertificationsByUsername = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = data;
    const user = yield User_1.User.find(dependencies_1.DatabaseService.setOptions({ limit: 2, offset: 0 }), { username });
    if (!user && username)
        throw boom_1.default.conflict("Username don't register!");
    console.log({ user });
    return user;
});
exports.getCertificationsByUsername = getCertificationsByUsername;
const getOwnCertifications = (data) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getOwnCertifications = getOwnCertifications;
const getCertificationByUUID = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Certification_1.Certification.find(dependencies_1.DatabaseService, data);
});
exports.getCertificationByUUID = getCertificationByUUID;
const addNewCertification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.user)
        throw boom_1.default.conflict("A user must be instanced!");
    const institutionUUID = (yield Institution_1.Institution.find(dependencies_1.DatabaseService, {
        name: data.emitedBy,
    })).uuid;
    const certification = yield Certification_1.Certification.create(dependencies_1.DatabaseService, Object.assign(Object.assign({}, data), { institutionUUID }));
    yield User_Certification_1.User_Certification.create(dependencies_1.DatabaseService, {
        userUUID: data.user.uuid,
        certificationUUID: certification.uuid,
    });
    return certification;
});
exports.addNewCertification = addNewCertification;
const addManyCertifications = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { certifications } = data;
    const newCertifications = [];
    for (var certification of certifications) {
        newCertifications.push(yield (0, exports.addNewCertification)(Object.assign(Object.assign({}, certification), { user: data.user })));
    }
    return newCertifications;
});
exports.addManyCertifications = addManyCertifications;
const updateCertification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, uuid } = data;
    const user_certification = yield User_Certification_1.User_Certification.find(dependencies_1.DatabaseService, {
        certificationUUID: uuid,
    });
    if (user_certification.userUUID !== user.uuid)
        throw boom_1.default.conflict("You are not the owner!");
    yield (yield Certification_1.Certification.load(dependencies_1.DatabaseService, { uuid })).update(dependencies_1.DatabaseService, data);
    return yield (0, exports.getCertificationByUUID)({ uuid });
});
exports.updateCertification = updateCertification;
const removeCertification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ data });
    yield (yield User_Certification_1.User_Certification.load(dependencies_1.DatabaseService, {
        certificationUUID: data.uuid,
    })).remove(dependencies_1.DatabaseService);
    yield (yield Certification_1.Certification.load(dependencies_1.DatabaseService, { uuid: data.uuid })).remove(dependencies_1.DatabaseService);
    return { message: "Certification deleted", uuid: data.uuid };
});
exports.removeCertification = removeCertification;
