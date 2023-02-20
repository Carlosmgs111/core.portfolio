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
const entity_1 = require("./entity");
const entity_2 = require("../users/entity");
const boom_1 = __importDefault(require("@hapi/boom"));
const JWT_1 = require("../../infrastructure/auth/JWT");
const DTOs_1 = require("./DTOs");
const getCertifications = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, user, size, page } = data;
    return (0, DTOs_1.formatCertifications)(yield entity_1.Certification.findAll(dependencies_1.RepositoryService, {
        related: [
            [
                "User",
                {
                    attributes: ["username"],
                    // ! ⚠️ must implement a correct use of filtered finding with related entities
                    // ? ⚠️ this just work fine with sequelize adapter
                    // ? ⚠️ must be implemented in mongoose adapter
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
    return yield entity_2.User.certifications(dependencies_1.RepositoryService, {
        username: user.username,
    });
});
exports.getOwnCertifications = getOwnCertifications;
const getCertificationByUUID = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield entity_1.Certification.find(dependencies_1.RepositoryService, data);
});
exports.getCertificationByUUID = getCertificationByUUID;
const addNewCertification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.user)
        throw boom_1.default.conflict("A user must be instanced!");
    const certification = yield entity_1.Certification.createOne(dependencies_1.RepositoryService, data);
    return Object.assign(Object.assign({}, certification), { emitedBy: data.emitedBy, grantedTo: data.user.username });
});
exports.addNewCertification = addNewCertification;
const addManyCertifications = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { certifications, user, emitedBy } = data;
    const newCertifications = yield entity_1.Certification.createMany(dependencies_1.RepositoryService, certifications.map((c) => (Object.assign(Object.assign({}, c), { user }))));
    return newCertifications.map((c) => (Object.assign(Object.assign({}, c), { emitedBy, grantedTo: user.username })));
});
exports.addManyCertifications = addManyCertifications;
const updateCertification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, uuid } = data;
    yield (yield entity_1.Certification.load(dependencies_1.RepositoryService, {
        credentials: { uuid },
    })).update(dependencies_1.RepositoryService, data);
    return (0, DTOs_1.formatCertifications)([
        Object.assign(Object.assign({}, (yield (0, exports.getCertificationByUUID)({
            credentials: { uuid },
            related: [["Institution", { attributes: ["name"], as: "Institution" }]],
        }))), { Users: [user] }),
    ])[0];
});
exports.updateCertification = updateCertification;
const removeCertification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (yield entity_1.Certification.load(dependencies_1.RepositoryService, {
        credentials: { uuid: data.uuid },
    })).remove(dependencies_1.RepositoryService, { userUUID: data.user.uuid });
    return { message: "Certification deleted", uuid: data.uuid };
});
exports.removeCertification = removeCertification;
