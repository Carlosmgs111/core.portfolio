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
exports.migrateDescriptionToDescriptions = exports.updateProject = exports.deleteProject = exports.addProject = exports.getProjects = void 0;
const dependencies_1 = require("../../config/dependencies");
const Project_1 = require("../../domain/entities/Project");
const utils_1 = require("../../utils");
const formatProjects = (projects) => projects.map((project) => (0, utils_1.filterAttrs)(Object.assign(Object.assign({}, project.dataValues), { createdBy: project.User.username }), [
    "User",
]));
const getProjects = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, user, size, page } = data;
    const projects = yield dependencies_1.DatabaseService.setupModel("Project").findAll({
        related: dependencies_1.DatabaseService.getRelated([
            ["User", { as: "User", where: username && { username } }],
        ]),
        size,
        page,
    });
    return formatProjects(projects);
});
exports.getProjects = getProjects;
const addProject = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield Project_1.Project.new(dependencies_1.DatabaseService, data); });
exports.addProject = addProject;
const deleteProject = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield (yield Project_1.Project.load(dependencies_1.DatabaseService, data)).remove(dependencies_1.DatabaseService); });
exports.deleteProject = deleteProject;
const updateProject = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (yield Project_1.Project.load(dependencies_1.DatabaseService, { uuid: data.uuid })).update(dependencies_1.DatabaseService, data);
});
exports.updateProject = updateProject;
// ! used only when the structure of a entity change and is necessary a reorder o modification of some attributes without change integrity of entity data
const migrateDescriptionToDescriptions = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield dependencies_1.DatabaseService.setupModel("Project").findAll();
    console.log({ projects });
    for (var project of projects) {
        const descriptions = project.description.split(". ");
        console.log({ descriptions });
        yield (0, exports.updateProject)({ uuid: project.uuid, descriptions, user: data.user });
    }
    return "OK!";
});
exports.migrateDescriptionToDescriptions = migrateDescriptionToDescriptions;
