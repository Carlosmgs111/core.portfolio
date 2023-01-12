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
exports.deleteInstitution = exports.unlinkFromInstitution = exports.linkToIntitution = exports.updateInstitution = exports.getAllInstitutions = exports.addNewInstitution = void 0;
const Institution_1 = require("../../domain/entities/Institution");
const dependencies_1 = require("../../config/dependencies");
const JWT_1 = require("../../infrastructure/auth/JWT");
const boom_1 = __importDefault(require("@hapi/boom"));
const addNewInstitution = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.user)
        throw boom_1.default.conflict("A user must be instanced!");
    const institution = yield Institution_1.Institution.create(dependencies_1.RepositoryService, data);
    return institution;
});
exports.addNewInstitution = addNewInstitution;
const getAllInstitutions = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Institution_1.Institution.findAll(dependencies_1.RepositoryService, data);
});
exports.getAllInstitutions = getAllInstitutions;
const updateInstitution = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (yield Institution_1.Institution.load(dependencies_1.RepositoryService, { uuid: data.uuid })).update(dependencies_1.RepositoryService, data);
});
exports.updateInstitution = updateInstitution;
const linkToIntitution = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { institutionUUID, token } = data;
    const { user } = yield (0, JWT_1.verifyToken2)(token);
    dependencies_1.RepositoryService.relateN2N([
        { label: "user", uuid: user.uuid },
        { label: "institution", uuid: institutionUUID },
    ]);
});
exports.linkToIntitution = linkToIntitution;
const unlinkFromInstitution = (data) => __awaiter(void 0, void 0, void 0, function* () { });
exports.unlinkFromInstitution = unlinkFromInstitution;
const deleteInstitution = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (yield Institution_1.Institution.load(dependencies_1.RepositoryService, { uuid: data.uuid })).remove(dependencies_1.RepositoryService, { userUUID: data.user.uuid });
    return { message: "Intitution deleted", uuid: data.uuid };
});
exports.deleteInstitution = deleteInstitution;
