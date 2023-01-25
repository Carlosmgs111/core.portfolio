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
        this.remove = (RepositoryService) => __awaiter(this, void 0, void 0, function* () {
            yield RepositoryService.unsetOneRelationship2One({}, [{}]);
            return yield RepositoryService.removeOne(RepositoryService.entities.Project, {
                credentials: { uuid: this.uuid },
            });
        });
        this.update = (RepositoryService, data) => __awaiter(this, void 0, void 0, function* () {
            this.updatedAt = new Date().getTime();
            return yield RepositoryService.updateOne(RepositoryService.entities.Project, Object.assign(Object.assign({}, this), data), { credentials: { uuid: this.uuid } });
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
Project.new = (RepositoryService, data) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = (0, uuid_1.v4)();
    const newProject = yield RepositoryService.createOne(RepositoryService.entities.Project, new Project(Object.assign(Object.assign({}, data), { uuid })));
    yield RepositoryService.setOneRelationship2One({ project: { uuid: newProject.uuid } }, [{ user: { uuid: data.user.uuid } }]);
    return newProject;
});
Project.createMany = (RepositoryService, data) => __awaiter(void 0, void 0, void 0, function* () {
    const projectsCreated = yield RepositoryService.createMany(RepositoryService.entities.Project, data.map((c) => new Project(Object.assign(Object.assign({}, c), { uuid: c.uuid || (0, uuid_1.v4)() }))));
    for (let project in projectsCreated) {
        yield RepositoryService.setOneRelationship2One({ project: { uuid: projectsCreated[project].uuid } }, [
            {
                user: { uuid: data[project].user.uuid },
            },
        ]);
    }
    return projectsCreated;
});
Project.load = (RepositoryService, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const loadedProject = yield Project.find(RepositoryService, credentials);
    if (!loadedProject)
        throw new Error("Incorrect credentials!");
    const project = new Project(loadedProject);
    return project;
});
Project.find = (RepositoryService, options) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield RepositoryService.findOne(RepositoryService.entities.Project, options);
    return account;
});
Project.findAll = (RepositoryService, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield RepositoryService.findAll(RepositoryService.entities.Project, options);
    return projects;
});
