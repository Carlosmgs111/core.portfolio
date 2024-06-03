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
const utils_1 = require("../../../utils");
const uuid_1 = require("uuid");
class Project {
    constructor({ uuid, 
    // userUUID,
    name, descriptions, images, tags, uri, version, }) {
        this.createdAt = 0;
        this.updatedAt = 0;
        this.remove = (RepositoryService_1, ...args_1) => __awaiter(this, [RepositoryService_1, ...args_1], void 0, function* (RepositoryService, options = {}) {
            const { uuid } = this;
            const removed = yield RepositoryService.unsetOneRelationshipManyToMany([
                [{ user: { uuid: options.userUUID } }, { project: { uuid: this.uuid } }],
            ]);
            if (!removed)
                return;
            return yield RepositoryService.removeOne(RepositoryService.entities.Project, {
                credentials: { uuid },
            });
        });
        this.update = (RepositoryService, data) => __awaiter(this, void 0, void 0, function* () {
            this.updatedAt = new Date().getTime();
            return yield RepositoryService.updateOne(RepositoryService.entities.Project, Object.assign({ updatedAt: this.updatedAt }, (0, utils_1.filterAttrs)(data, ["uuid", "user", "token"])), { credentials: { uuid: this.uuid } });
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
    const newProject = yield RepositoryService.createOne(RepositoryService.entities.Project, new _a(Object.assign(Object.assign({}, data), { uuid })));
    yield RepositoryService.setOneRelationship2One({ project: { uuid: newProject.uuid } }, [{ user: { uuid: data.user.uuid } }]);
    return newProject;
});
Project.createMany = (RepositoryService, data) => __awaiter(void 0, void 0, void 0, function* () {
    const projectsCreated = yield RepositoryService.createMany(RepositoryService.entities.Project, data.map((c) => new _a(Object.assign(Object.assign({}, c), { uuid: c.uuid || (0, uuid_1.v4)() }))));
    for (let projectIdx in data) {
        yield RepositoryService.setOneRelationshipManyToMany([
            [
                {
                    project: {
                        uuid: projectsCreated[Number(projectIdx)].uuid,
                    },
                },
                { user: { uuid: data[Number(projectIdx)].user.uuid } },
            ],
        ]);
    }
    return projectsCreated.map((p, i) => (Object.assign(Object.assign({}, p), { Users: [{ username: data[i].user.username }] })));
});
Project.load = (RepositoryService, options) => __awaiter(void 0, void 0, void 0, function* () {
    const loadedProject = yield _a.find(RepositoryService, options);
    if (!loadedProject)
        throw new Error("Incorrect credentials!");
    const project = new _a(loadedProject);
    return project;
});
Project.find = (RepositoryService, options) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield RepositoryService.findOne(RepositoryService.entities.Project, options);
    return account;
});
Project.findAll = (RepositoryService_1, ...args_1) => __awaiter(void 0, [RepositoryService_1, ...args_1], void 0, function* (RepositoryService, options = {}) {
    const projects = yield RepositoryService.findAll(RepositoryService.entities.Project, options);
    return projects;
});
