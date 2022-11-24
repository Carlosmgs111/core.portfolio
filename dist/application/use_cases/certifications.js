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
exports.removeCertification = exports.updateCertification = exports.addManyCertifications = exports.addNewCertification = exports.getCertificationByUUID = exports.getCertifications = void 0;
const dependencies_1 = require("../../config/dependencies");
const Certification_1 = require("../../domain/entities/Certification");
const Institution_1 = require("../../domain/entities/Institution");
const User_Certification_1 = require("../../domain/entities/User_Certification");
const boom_1 = __importDefault(require("@hapi/boom"));
const getCertifications = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Certification_1.Certification.findAll(dependencies_1.DatabaseService, data);
});
exports.getCertifications = getCertifications;
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
    for (var certification of certifications) {
        yield (0, exports.addNewCertification)(Object.assign(Object.assign({}, certification), { user: data.user }));
    }
    return certifications;
});
exports.addManyCertifications = addManyCertifications;
const updateCertification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (yield Certification_1.Certification.load(dependencies_1.DatabaseService, { uuid: data.uuid })).update(dependencies_1.DatabaseService, data);
    return yield (0, exports.getCertificationByUUID)({ uuid: data.uuid });
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
