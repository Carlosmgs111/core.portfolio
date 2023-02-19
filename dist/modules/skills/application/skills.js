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
exports.updateSkill = exports.deleteSkill = exports.addManySkills = exports.addNewSkill = exports.getSkillByUUID = exports.getAllSkills = void 0;
const Skill_1 = require("../domain/Skill");
const dependencies_1 = require("../../../config/dependencies");
const utils_1 = require("../../../utils");
const formatSkills = (skills) => skills.map((skill) => (0, utils_1.filterAttrs)(Object.assign(Object.assign({}, skill), { dominatedBy: skill.Users.map(({ username }) => username) }), ["Users"]));
const getAllSkills = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return formatSkills(yield dependencies_1.RepositoryService.findAll(dependencies_1.RepositoryService.entities.Skill, {
        related: [["User", { attributes: ["username"] }]],
    }));
});
exports.getAllSkills = getAllSkills;
const getSkillByUUID = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Skill_1.Skill.find(dependencies_1.RepositoryService, data);
});
exports.getSkillByUUID = getSkillByUUID;
const addNewSkill = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Skill_1.Skill.create(dependencies_1.RepositoryService, data);
});
exports.addNewSkill = addNewSkill;
const addManySkills = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { skills, user } = data;
    const newSkills = yield Skill_1.Skill.createMany(dependencies_1.RepositoryService, skills.map((c) => (Object.assign(Object.assign({}, c), { user }))));
    return newSkills.map((c) => (Object.assign(Object.assign({}, c), { dominatedBy: user.username })));
});
exports.addManySkills = addManySkills;
const deleteSkill = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (yield Skill_1.Skill.load(dependencies_1.RepositoryService, data)).remove(dependencies_1.RepositoryService, { userUUID: data.user.uuid });
    return { message: "Skill deleted", uuid: data.uuid };
});
exports.deleteSkill = deleteSkill;
const updateSkill = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, uuid } = data;
    yield (yield Skill_1.Skill.load(dependencies_1.RepositoryService, { credentials: { uuid } })).update(dependencies_1.RepositoryService, data);
    return formatSkills([
        yield (0, exports.getSkillByUUID)({
            credentials: { uuid },
            related: [["User", { attributes: ["username"], as: "Users" }]],
        }),
    ])[0];
});
exports.updateSkill = updateSkill;
