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
exports.Certification = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../../utils");
const boom_1 = __importDefault(require("@hapi/boom"));
class Certification {
    constructor({ uuid, title, emitedAt, image, url, tags }) {
        this.uuid = "";
        this.title = "";
        this.emitedAt = 0; // * timestamp
        this.image = ""; // * url to image
        this.url = ""; // * url to certificated course or institution
        this.createdAt = 0;
        this.updatedAt = 0;
        this.remove = (DatabaseServices, options = {}) => __awaiter(this, void 0, void 0, function* () {
            yield DatabaseServices.unrelateN2N([
                [
                    { label: "user", pk: options.userUUID },
                    { label: "certification", pk: this.uuid },
                ],
            ]);
            return yield DatabaseServices.remove(DatabaseServices.entities.Certification, {
                credentials: (0, utils_1.filterAttrs)((0, utils_1.getEntityProperties)(this), ["title", "uuid"], false),
            });
        });
        this.update = (DatabaseServices, data) => __awaiter(this, void 0, void 0, function* () {
            const [exist] = yield DatabaseServices.checkRelationship(DatabaseServices.entities.Certification, { label: "certification", pk: this.uuid }, { label: "user", pk: data.user.uuid });
            if (!exist)
                throw boom_1.default.conflict("Relationship doesn't exist!");
            this.updatedAt = new Date().getTime();
            yield DatabaseServices.update(Object.assign({ updatedAt: this.updatedAt }, (0, utils_1.filterAttrs)(data, ["uuid", "user", "token"])), { credentials: { uuid: this.uuid } });
            return this;
        });
        this.uuid = uuid;
        this.title = title;
        this.emitedAt = emitedAt;
        this.image = image;
        this.url = url;
        this.tags = tags;
        this.createdAt = new Date().getTime();
        this.updatedAt = new Date().getTime();
    }
}
exports.Certification = Certification;
_a = Certification;
Certification.create = (DatabaseServices, data) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = (0, uuid_1.v4)();
    const { emitedBy } = data;
    const certification = yield DatabaseServices.relate2One(new Certification(Object.assign(Object.assign({}, data), { uuid })), [
        {
            institution: { name: emitedBy },
        },
    ]);
    yield DatabaseServices.create(DatabaseServices.entities.Certification, certification);
    yield DatabaseServices.relateN2N([
        [
            { label: "certification", pk: uuid },
            { label: "user", pk: data.user.uuid },
        ],
    ]);
    return certification;
});
Certification.createMany = (DatabaseServices, data) => __awaiter(void 0, void 0, void 0, function* () {
    const certifications = [];
    for (let certification of data) {
        certifications.push(yield DatabaseServices.relate2One(new Certification(Object.assign(Object.assign({}, certification), { uuid: (0, uuid_1.v4)() })), [
            {
                institution: { name: certification.emitedBy },
            },
        ]));
    }
    console.log({ certifications
    });
    const certificationsCreated = yield DatabaseServices.createMany(DatabaseServices.entities.Certification, certifications);
    for (let certificationIdx in data) {
        yield DatabaseServices.relateN2N([
            [
                {
                    label: "certification",
                    pk: certifications[Number(certificationIdx)].uuid,
                },
                { label: "user", pk: data[Number(certificationIdx)].user.uuid },
            ],
        ]);
    }
    console.log({ certificationsCreated });
    return certifications;
});
Certification.load = (DatabaseServices, options) => __awaiter(void 0, void 0, void 0, function* () {
    const certification = yield Certification.find(DatabaseServices, options);
    if (!certification)
        throw new Error("Incorrect credentials!");
    const loadedCertification = new Certification(certification);
    return loadedCertification;
});
Certification.find = (DatabaseServices, options) => __awaiter(void 0, void 0, void 0, function* () {
    const certificate = yield DatabaseServices.findOne(DatabaseServices.entities.Certification, options);
    return certificate;
});
Certification.findAll = (DatabaseServices, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const certificates = yield DatabaseServices.findAll(DatabaseServices.entities.Certification, options);
    return certificates;
});
