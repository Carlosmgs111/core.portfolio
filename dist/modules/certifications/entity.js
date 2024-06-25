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
        this.update = (RepositoryService, data) => __awaiter(this, void 0, void 0, function* () {
            this.updatedAt = new Date().getTime();
            const { Institution: { name: emitedBy }, } = yield _a.find(RepositoryService, {
                credentials: { uuid: this.uuid },
                related: [["Institution", { attributes: ["name"], as: "Institution" }]],
            });
            data.emitedBy, emitedBy;
            if (data.emitedBy && emitedBy !== data.emitedBy) {
                "Must change relationship".bgYellow;
                yield RepositoryService.unsetOneRelationship2One({ certifications: { uuid: this.uuid } }, [["Institution", { as: "Institution" }]]);
                yield RepositoryService.setOneRelationship2One({ certifications: { uuid: this.uuid } }, [
                    {
                        institution: { name: data.emitedBy },
                    },
                ]);
            }
            return yield RepositoryService.updateOne(RepositoryService.entities.Certification, Object.assign({ updatedAt: this.updatedAt }, (0, utils_1.filterAttrs)(data, ["uuid", "user", "token"])), { credentials: { uuid: this.uuid } });
        });
        this.remove = (RepositoryService_1, ...args_1) => __awaiter(this, [RepositoryService_1, ...args_1], void 0, function* (RepositoryService, options = {}) {
            yield RepositoryService.unsetOneRelationship2One({ certifications: { uuid: this.uuid } }, [["Institution", { as: "Institution" }]]);
            const removed = yield RepositoryService.unsetOneRelationshipManyToMany([
                { user: { uuid: options.userUUID } },
                { certification: { uuid: this.uuid } },
            ]);
            if (!removed)
                return;
            return yield RepositoryService.removeOne(RepositoryService.entities.Certification, {
                credentials: (0, utils_1.filterAttrs)((0, utils_1.getEntityProperties)(this), ["title", "uuid"], false),
            });
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
    const certification = yield RepositoryService.createOne(RepositoryService.entities.Certification, new _a(Object.assign(Object.assign({}, data), { uuid })));
    yield RepositoryService.setOneRelationship2One({ certifications: { uuid: certification.uuid } }, [
        {
            institution: { name: emitedBy },
        },
    ]);
    yield RepositoryService.setOneRelationshipManyToMany([
        [{ certification: { uuid } }, { user: { uuid: data.user.uuid } }],
    ]);
    return certification;
});
Certification.createMany = (RepositoryService, data) => __awaiter(void 0, void 0, void 0, function* () {
    const certificationsCreated = yield RepositoryService.createMany(RepositoryService.entities.Certification, data.map((c) => new _a(Object.assign(Object.assign({}, c), { uuid: c.uuid || (0, uuid_1.v4)() }))));
    for (let certification in certificationsCreated) {
        RepositoryService.setOneRelationship2One({ certifications: { uuid: certificationsCreated[certification].uuid } }, [
            {
                institution: { name: data[certification].emitedBy },
            },
        ]);
    }
    // const refsBatch = data.map((_: any, index: any) => [
    //   {
    //     certification: {
    //       uuid: certificationsCreated[Number(index)].uuid,
    //     },
    //   },
    //   { user: { uuid: data[Number(index)].user.uuid } },
    // ]);
    // RepositoryService.setManyRelationshipsManyToMany(refsBatch);
    for (let certificationIdx in data) {
        RepositoryService.setOneRelationshipManyToMany([
            {
                certification: {
                    uuid: certificationsCreated[Number(certificationIdx)].uuid,
                },
            },
            { user: { uuid: data[Number(certificationIdx)].user.uuid } },
        ]);
    }
    return certificationsCreated;
});
Certification.load = (RepositoryService, options) => __awaiter(void 0, void 0, void 0, function* () {
    const certification = yield _a.find(RepositoryService, options);
    if (!certification)
        throw new Error("Incorrect credentials!");
    const loadedCertification = new _a(certification);
    return loadedCertification;
});
Certification.find = (RepositoryService, options) => __awaiter(void 0, void 0, void 0, function* () {
    const certificate = yield RepositoryService.findOne(RepositoryService.entities.Certification, options);
    return certificate;
});
Certification.findAll = (RepositoryService_1, ...args_1) => __awaiter(void 0, [RepositoryService_1, ...args_1], void 0, function* (RepositoryService, options = {}) {
    const certificates = yield RepositoryService.findAll(RepositoryService.entities.Certification, options);
    return certificates;
});
