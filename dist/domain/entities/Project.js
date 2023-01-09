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
    constructor({ uuid, 
    // userUUID,
    name, descriptions, images, tags, uri, version, }) {
        this.createdAt = 0;
        this.updatedAt = 0;
        this.remove = (DatabaseServices) => __awaiter(this, void 0, void 0, function* () {
            return yield DatabaseServices.remove(DatabaseServices.entities.Project, {
                credentials: { uuid: this.uuid },
            });
        });
        this.update = (DatabaseServices, data) => __awaiter(this, void 0, void 0, function* () {
            this.updatedAt = new Date().getTime();
            return yield DatabaseServices.update(DatabaseServices.entities.Project, Object.assign(Object.assign({}, this), data), { credentials: { uuid: this.uuid } });
        });
        this.uuid = uuid;
        // this.userUUID = userUUID;
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
    const uuid = (0, uuid_1.v4)();
    const project = yield DatabaseServices.relate2One(new Project(Object.assign(Object.assign({}, data), { uuid })), [{ user: { uuid: data.user.uuid } }]);
    return yield DatabaseServices.create(DatabaseServices.entities.Project, project);
});
Project.load = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const loadedProject = yield Project.find(DatabaseServices, credentials);
    if (!loadedProject)
        throw new Error("Incorrect credentials!");
    const project = new Project(loadedProject);
    return project;
});
Project.find = (DatabaseServices, options) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield DatabaseServices.findOne(DatabaseServices.entities.Project, options);
    return account;
});
Project.findAll = (DatabaseServices, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield DatabaseServices.findAll(DatabaseServices.entities.Project, options);
    return projects;
});
