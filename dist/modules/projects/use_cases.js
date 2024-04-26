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
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateRelationship2OneToN2N = exports.migrateDescriptionToDescriptions = exports.updateProject = exports.deleteProject = exports.addManyProject = exports.addProject = exports.getOwnProjects = exports.getProjects = void 0;
const dependencies_1 = require("../../config/dependencies");
const entity_1 = require("./entity");
const entity_2 = require("../users/entity");
const utils_1 = require("../../utils");
const enums_1 = require("../../enums");
const formatProjects = (projects) => projects.map((project) => (0, utils_1.filterAttrs)(Object.assign(Object.assign({}, project), { buildedBy: project.Users.map(({ username }) => username) }), ["Users"]));
const getProjects = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, user, size, page } = data;
    ({ user });
    const projects = yield entity_1.Project.findAll(dependencies_1.RepositoryService, {
        related: [["User", { attributes: ["username"] }]],
        size,
        page,
    });
    const formatedProjects = formatProjects(projects);
    return {
        projects: formatedProjects,
        kind: (0, utils_1.fromEnumToArray)(enums_1.kind),
        state: (0, utils_1.fromEnumToArray)(enums_1.state),
        stack: (0, utils_1.fromEnumToArray)(enums_1.stack),
    };
});
exports.getProjects = getProjects;
const getOwnProjects = (data) => __awaiter(void 0, void 0, void 0, function* () {
    ({ data });
    const { token } = data;
    const { user } = yield dependencies_1.AuthServices.verifyKey(token);
    return yield entity_2.User.projects(dependencies_1.RepositoryService, user);
});
exports.getOwnProjects = getOwnProjects;
const addProject = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield entity_1.Project.new(dependencies_1.RepositoryService, data); });
exports.addProject = addProject;
const addManyProject = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { projects, user } = data;
    const newProjects = yield entity_1.Project.createMany(dependencies_1.RepositoryService, projects.map((c) => (Object.assign(Object.assign({}, c), { user }))));
    return formatProjects(newProjects);
});
exports.addManyProject = addManyProject;
const deleteProject = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (yield entity_1.Project.load(dependencies_1.RepositoryService, { credentials: { uuid: data.uuid } })).remove(dependencies_1.RepositoryService, { userUUID: data.user.uuid });
    return { message: "Project deleted", uuid: data.uuid };
});
exports.deleteProject = deleteProject;
const updateProject = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, uuid } = data;
    const result = yield (yield entity_1.Project.load(dependencies_1.RepositoryService, { credentials: { uuid } })).update(dependencies_1.RepositoryService, (0, utils_1.filterAttrs)(data, ["uuid", "user", "token"]));
    return { updated: result };
});
exports.updateProject = updateProject;
// ! used only when the structure of a entity change and is necessary a reorder o modification of some attributes without change integrity of entity data
const migrateDescriptionToDescriptions = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield dependencies_1.RepositoryService.findAll(dependencies_1.RepositoryService.entities.Project);
    ({ projects });
    for (var project of projects) {
        const descriptions = project.description.split(". ");
        ({ descriptions });
        yield (0, exports.updateProject)({ uuid: project.uuid, descriptions, user: data.user });
    }
    return "OK!";
});
exports.migrateDescriptionToDescriptions = migrateDescriptionToDescriptions;
const migrateRelationship2OneToN2N = () => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield entity_1.Project.findAll(dependencies_1.RepositoryService, {
        related: [
            [
                "User",
                {
                    as: "User",
                    attributes: ["uuid"],
                },
            ],
        ],
    });
    for (let project of projects) {
        const { User, Users } = project;
        if (User && Users.length === 0) {
            ({ User, Users });
            /* await RepositoryService.CommandService.setOneRelationshipManyToMany([
              [{ project: { uuid: project.uuid } }, { user: { uuid: User.uuid } }],
            ]); */
            /*  await RepositoryService.QueryService.setOneRelationship2One(
              { user: { uuid: User.uuid } },
              [
                {
                  project: { uuid: project.uuid },
                },
              ]
            ); */
        }
        /* await RepositoryService.QueryService.removeAttribute(
          RepositoryService.entities.Project,
          { User: "" }
        ); */
    }
});
exports.migrateRelationship2OneToN2N = migrateRelationship2OneToN2N;
