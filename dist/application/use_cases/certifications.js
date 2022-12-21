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
exports.removeCertification = exports.updateCertification = exports.addManyCertifications = exports.addNewCertification = exports.getCertificationByUUID = exports.getOwnCertifications = exports.getCertifications = void 0;
const dependencies_1 = require("../../config/dependencies");
const Certification_1 = require("../../domain/entities/Certification");
const Institution_1 = require("../../domain/entities/Institution");
const User_Certification_1 = require("../../domain/entities/User_Certification");
const User_1 = require("../../domain/entities/User");
const boom_1 = __importDefault(require("@hapi/boom"));
const utils_1 = require("../../utils");
const JWT_1 = require("../../infrastructure/auth/JWT");
const formatCertifications = (certifications) => certifications
    .map((certification) => (0, utils_1.filterAttrs)(Object.assign(Object.assign({}, certification.dataValues), { emitedAt: new Date(certification.dataValues.emitedAt).getTime(), grantedTo: certification.Users[0].username, emitedBy: certification.Institution.name }), ["Users", "Institution"]))
    .sort((a, b) => {
    if (a.emitedAt < b.emitedAt)
        return 1;
    return -1;
});
const getCertifications = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, user, size: limit, page: offset } = data;
    return formatCertifications((yield Certification_1.Certification.findAll(dependencies_1.DatabaseService.setInclude([
        [
            "User",
            {
                attributes: ["username"],
                where: username && { username },
            },
        ],
        ["Institution", { attributes: ["name"], alias: "Institution" }],
    ]).setOptions({
        limit,
        offset,
    }), {})).map((c) => (Object.assign(Object.assign({}, c), { grantedTo: c.Users[0].username }))));
});
exports.getCertifications = getCertifications;
const getOwnCertifications = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = yield (0, JWT_1.verifyToken2)(data);
    return yield User_1.User.certifications(dependencies_1.DatabaseService, {
        username: user.username,
    });
});
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
    console.log({ certification });
    yield User_Certification_1.User_Certification.create(dependencies_1.DatabaseService, {
        userUUID: data.user.uuid,
        certificationUUID: certification.uuid,
    });
    return Object.assign(Object.assign({}, certification), { emitedBy: data.emitedBy, grantedTo: data.user.username });
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
    return Object.assign(Object.assign({}, (yield (0, exports.getCertificationByUUID)({ uuid })).dataValues), { emitedBy: data.emitedBy, grantedTo: data.user.username });
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
