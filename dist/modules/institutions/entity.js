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
        this.link = (RepositoryService, options) => __awaiter(this, void 0, void 0, function* () { });
        this.unlink = (RepositoryService, options) => __awaiter(this, void 0, void 0, function* () { });
        this.remove = (RepositoryService_1, ...args_1) => __awaiter(this, [RepositoryService_1, ...args_1], void 0, function* (RepositoryService, options = {}) {
            yield RepositoryService.unsetOneRelationshipManyToMany([
                [{ user: options.userUUID }, { institution: this.uuid }],
            ]);
            return yield RepositoryService.removeOne(RepositoryService.QueryService.entities.Institution, {
                indexation: { uuid: this.uuid },
            });
        });
        this.update = (RepositoryService, data) => __awaiter(this, void 0, void 0, function* () {
            this.updatedAt = new Date().getTime();
            return yield RepositoryService.updateOne(RepositoryService.QueryService.entities.Institution, Object.assign(Object.assign({}, this), data), { indexation: { uuid: this.uuid } });
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
Institution.create = (RepositoryService, data) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = (0, uuid_1.v4)();
    const institution = new _a(Object.assign(Object.assign({}, data), { uuid }));
    yield RepositoryService.createOne(RepositoryService.QueryService.entities.Institution, institution);
    // ? This can be called in another method for be unecessary to relate a user with institution when it is creted
    yield RepositoryService.setOneRelationshipManyToMany([
        [{ institution: { uuid } }, { user: { uuid: data.user.uuid } }],
    ]);
    return institution;
});
Institution.load = (RepositoryService, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield _a.find(RepositoryService, credentials);
    if (!project)
        throw new Error("Incorrect credentials!");
    const institution = new _a(project);
    return institution;
});
Institution.find = (RepositoryService, indexation) => __awaiter(void 0, void 0, void 0, function* () {
    const institution = yield RepositoryService.findOne(RepositoryService.QueryService.entities.Institution, {
        indexation,
    });
    return institution;
});
Institution.findAll = (RepositoryService, options) => __awaiter(void 0, void 0, void 0, function* () {
    const institutions = yield RepositoryService.findAll(RepositoryService.QueryService.entities.Institution, options);
    return institutions;
});
