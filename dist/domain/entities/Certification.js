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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certification = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../../utils");
class Certification {
    constructor({ uuid, title, emitedAt, image, url, tags }) {
        this.uuid = "";
        this.title = "";
        this.emitedAt = 0; // * timestamp
        this.image = ""; // * url to image
        this.url = ""; // * url to certificated course or institution
        this.createdAt = 0;
        this.updatedAt = 0;
        this.remove = (RepositoryService, options = {}) => __awaiter(this, void 0, void 0, function* () {
            yield RepositoryService.removeOneRelationship2One({ certifications: { uuid: this.uuid } }, [["Institution", { as: "Institution" }]]);
            yield RepositoryService.removeOneRelationshipN2N([
                [
                    { label: "user", pk: options.userUUID },
                    { label: "certification", pk: this.uuid },
                ],
            ]);
            return yield RepositoryService.removeOne(RepositoryService.entities.Certification, {
                credentials: (0, utils_1.filterAttrs)((0, utils_1.getEntityProperties)(this), ["title", "uuid"], false),
            });
        });
        this.update = (RepositoryService, data) => __awaiter(this, void 0, void 0, function* () {
            this.updatedAt = new Date().getTime();
            const { Institution: { name: emitedBy }, } = yield Certification.find(RepositoryService, {
                credentials: { uuid: this.uuid },
                related: [["Institution", { attributes: ["name"], as: "Institution" }]],
            });
            if (data.emitedBy && emitedBy !== data.emitedBy)
                console.log("Must change relationship".bgYellow);
            yield RepositoryService.updateOne(RepositoryService.entities.Certification, Object.assign({ updatedAt: this.updatedAt }, (0, utils_1.filterAttrs)(data, ["uuid", "user", "token"])), { credentials: { uuid: this.uuid } });
            return this;
        });
        this.uuid = uuid;
        this.title = title;
        this.emitedAt = emitedAt;
        this.image = image;
        this.url = url;
        this.tags = tags;
        this.createdAt = new Date().getTime();
        this.updatedAt = this.createdAt;
    }
}
exports.Certification = Certification;
_a = Certification;
Certification.createOne = (RepositoryService, data) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = data.uuid || (0, uuid_1.v4)();
    const { emitedBy } = data;
    const certification = yield RepositoryService.createOne(RepositoryService.entities.Certification, new Certification(Object.assign(Object.assign({}, data), { uuid })));
    yield RepositoryService.createOneRelationship2One({ certifications: { uuid: certification.uuid } }, [
        {
            institution: { name: emitedBy },
        },
    ]);
    yield RepositoryService.createOneRelationshipN2N([
        [
            { label: "certification", pk: uuid },
            { label: "user", pk: data.user.uuid },
        ],
    ]);
    return certification;
});
Certification.createMany = (RepositoryService, data) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log({ data });
    const certificationsCreated = yield RepositoryService.createMany(RepositoryService.entities.Certification, data.map((c) => new Certification(Object.assign(Object.assign({}, c), { uuid: c.uuid || (0, uuid_1.v4)() }))));
    for (let certification in certificationsCreated) {
        yield RepositoryService.createOneRelationship2One({ certifications: { uuid: certificationsCreated[certification].uuid } }, [
            {
                institution: { name: data[certification].emitedBy },
            },
        ]);
    }
    for (let certificationIdx in data) {
        yield RepositoryService.createOneRelationshipN2N([
            [
                {
                    label: "certification",
                    pk: certificationsCreated[Number(certificationIdx)].uuid,
                },
                { label: "user", pk: data[Number(certificationIdx)].user.uuid },
            ],
        ]);
    }
    // console.log({ certificationsCreated });
    return certificationsCreated;
});
Certification.load = (RepositoryService, options) => __awaiter(void 0, void 0, void 0, function* () {
    const certification = yield Certification.find(RepositoryService, options);
    if (!certification)
        throw new Error("Incorrect credentials!");
    const loadedCertification = new Certification(certification);
    console.log({ loadedCertification });
    return loadedCertification;
});
Certification.find = (RepositoryService, options) => __awaiter(void 0, void 0, void 0, function* () {
    const certificate = yield RepositoryService.findOne(RepositoryService.entities.Certification, options);
    return certificate;
});
Certification.findAll = (RepositoryService, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const certificates = yield RepositoryService.findAll(RepositoryService.entities.Certification, options);
    return certificates;
});
