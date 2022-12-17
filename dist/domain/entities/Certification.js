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
    constructor({ uuid, title, institutionUUID, emitedAt, image, url, tags }) {
        this.uuid = "";
        this.title = "";
        this.institutionUUID = ""; // * ID to institution
        this.emitedAt = 0; // * timestamp
        this.image = ""; // * url to image
        this.url = ""; // * url to certificated course or institution
        this.createdAt = 0;
        this.updatedAt = 0;
        this.remove = (DatabaseServices) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupModel("Certification");
            return yield DatabaseServices.remove(Object.assign({}, (0, utils_1.filterAttrs)((0, utils_1.getEntityProperties)(this), ["businessName", "title", "uuid"], false)));
        });
        this.update = (DatabaseServices, data) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupModel("Certification");
            this.updatedAt = new Date().getTime();
            return yield DatabaseServices.update(Object.assign({}, (0, utils_1.getEntityProperties)(Object.assign(Object.assign({}, this), data))));
        });
        this.uuid = uuid;
        this.title = title;
        this.institutionUUID = institutionUUID;
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
    DatabaseServices.setupModel("Certification");
    const uuid = (0, uuid_1.v4)();
    const certification = new Certification(Object.assign(Object.assign({}, data), { uuid }));
    yield DatabaseServices.create(certification);
    // console.log({ certification })
    return certification;
});
Certification.load = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("Certification");
    const certification = yield Certification.find(DatabaseServices, { uuid: credentials.uuid });
    if (!certification)
        throw new Error("Incorrect credentials!");
    const loadedCertification = new Certification(certification);
    return loadedCertification;
});
Certification.find = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("Certification");
    const certificate = yield DatabaseServices.findOne(credentials);
    return certificate;
});
Certification.findAll = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("Certification");
    const certificate = yield DatabaseServices.findAll(credentials);
    return certificate;
});
