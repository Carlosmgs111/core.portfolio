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
const User_1 = require("../../domain/entities/User");
const boom_1 = __importDefault(require("@hapi/boom"));
const utils_1 = require("../../utils");
const JWT_1 = require("../../infrastructure/auth/JWT");
const format = (certifications) => certifications
    .map((certification) => (0, utils_1.filterAttrs)(Object.assign(Object.assign({}, certification), { emitedAt: new Date(certification.emitedAt).getTime(), grantedTo: certification.Users[0].username, emitedBy: certification.Institution.name }), ["Users", "Institution"]))
    .sort((a, b) => {
    if (a.emitedAt < b.emitedAt)
        return 1;
    return -1;
});
// ! ---------------------------------------------------------------------------------------------
const getCertifications = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, user, size, page } = data;
    return format(yield Certification_1.Certification.findAll(dependencies_1.DatabaseService, {
        related: [
            [
                "User",
                {
                    attributes: ["username"],
                    credentials: username && { username },
                },
            ],
            ["Institution", { attributes: ["name"], as: "Institution" }],
        ],
        size,
        page,
    }));
});
exports.getCertifications = getCertifications;
const getOwnCertifications = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = data;
    const { user } = yield (0, JWT_1.verifyToken2)(token);
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
    const certification = yield Certification_1.Certification.create(dependencies_1.DatabaseService, data);
    return Object.assign(Object.assign({}, certification), { emitedBy: data.emitedBy, grantedTo: data.user.username });
});
exports.addNewCertification = addNewCertification;
const addManyCertifications = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { certifications, user, emitedBy } = data;
    const newCertifications = yield Certification_1.Certification.createMany(dependencies_1.DatabaseService, certifications.map((c) => (Object.assign(Object.assign({}, c), { user }))));
    return newCertifications.map((c) => (Object.assign(Object.assign({}, c), { emitedBy, grantedTo: user.username })));
});
exports.addManyCertifications = addManyCertifications;
const updateCertification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, uuid } = data;
    yield (yield Certification_1.Certification.load(dependencies_1.DatabaseService, { credentials: { uuid } })).update(dependencies_1.DatabaseService, data);
    return format([
        Object.assign(Object.assign({}, (yield (0, exports.getCertificationByUUID)({
            credentials: { uuid },
            related: [["Institution", { attributes: ["name"], as: "Institution" }]],
        }))), { Users: [user] }),
    ])[0];
});
exports.updateCertification = updateCertification;
const removeCertification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (yield Certification_1.Certification.load(dependencies_1.DatabaseService, {
        credentials: { uuid: data.uuid },
    })).remove(dependencies_1.DatabaseService, { userUUID: data.user.uuid });
    return { message: "Certification deleted", uuid: data.uuid };
});
exports.removeCertification = removeCertification;
