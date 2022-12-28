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
exports.Institution = void 0;
const uuid_1 = require("uuid");
class Institution {
    constructor({ uuid, name, businessName, descriptions, urls }) {
        this.uuid = "";
        this.name = "";
        this.businessName = "";
        this.descriptions = [];
        this.urls = [];
        this.createdAt = 0;
        this.updatedAt = 0;
        this.link = (DatabaseServices, options) => __awaiter(this, void 0, void 0, function* () { });
        this.unlink = (DatabaseServices, options) => __awaiter(this, void 0, void 0, function* () { });
        this.remove = (DatabaseServices, options = {}) => __awaiter(this, void 0, void 0, function* () {
            yield DatabaseServices.unrelate({ label: "user", uuid: options.userUUID }, { label: "institution", uuid: this.uuid });
            return yield DatabaseServices.setupEntity("Institution").remove({
                credentials: { uuid: this.uuid },
            });
        });
        this.update = (DatabaseServices, data) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupEntity("Institution");
            this.updatedAt = new Date().getTime();
            return yield DatabaseServices.update(Object.assign(Object.assign({}, this), data), { credentials: { uuid: this.uuid } });
        });
        this.uuid = uuid;
        this.name = name;
        this.businessName = businessName;
        this.descriptions = descriptions;
        this.urls = urls;
        this.createdAt = new Date().getTime();
        this.updatedAt = new Date().getTime();
    }
}
exports.Institution = Institution;
_a = Institution;
Institution.create = (DatabaseServices, data) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = (0, uuid_1.v4)();
    const institution = new Institution(Object.assign(Object.assign({}, data), { uuid }));
    yield DatabaseServices.setupEntity("Institution").create(institution);
    // ? This can be called in another method for be unecessary to relate a user with institution when it is creted
    yield DatabaseServices.relate({ label: "institution", uuid }, { label: "user", uuid: data.user.uuid });
    return institution;
});
Institution.load = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupEntity("Institution");
    const project = yield Institution.find(DatabaseServices, credentials);
    if (!project)
        throw new Error("Incorrect credentials!");
    const institution = new Institution(project);
    return institution;
});
Institution.find = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupEntity("Institution");
    const institution = yield DatabaseServices.findOne({
        credentials,
    });
    return institution;
});
Institution.findAll = (DatabaseServices, options) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupEntity("Institution");
    const institutions = yield DatabaseServices.findAll(options);
    return institutions;
});
