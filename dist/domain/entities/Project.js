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
exports.Project = void 0;
const uuid_1 = require("uuid");
class Project {
    constructor({ uuid, userUUID, name, descriptions, images, tags, uri, version, }) {
        this.createdAt = 0;
        this.updatedAt = 0;
        this.remove = (DatabaseServices) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupModel("Project");
            return yield DatabaseServices.remove({ credentials: { uuid: this.uuid } });
        });
        this.update = (DatabaseServices, data) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupModel("Project");
            this.updatedAt = new Date().getTime();
            return yield DatabaseServices.update(Object.assign(Object.assign({}, this), data), { credentials: { uuid: this.uuid } });
        });
        this.uuid = uuid;
        this.userUUID = userUUID;
        this.name = name;
        this.descriptions = descriptions;
        this.images = images;
        this.tags = tags;
        this.uri = uri;
        this.version = version;
        this.createdAt = new Date().getTime();
        this.updatedAt = new Date().getTime();
    }
}
exports.Project = Project;
_a = Project;
Project.new = (DatabaseServices, data) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("Project");
    const uuid = (0, uuid_1.v4)();
    const account = new Project(Object.assign(Object.assign({}, data), { uuid, userUUID: data.user.uuid }));
    return yield DatabaseServices.create(account);
});
Project.load = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("Project");
    const project = yield Project.find(DatabaseServices, credentials);
    if (!project)
        throw new Error("Incorrect credentials!");
    const account = new Project(project);
    return account;
});
Project.find = (DatabaseServices, options) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("Project");
    const account = yield DatabaseServices.findOne(options);
    return account;
});
