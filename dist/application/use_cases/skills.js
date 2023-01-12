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
exports.updateSkill = exports.deleteSkill = exports.addNewSkill = exports.getAllSkills = void 0;
const Skill_1 = require("../../domain/entities/Skill");
const dependencies_1 = require("../../config/dependencies");
const getAllSkills = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield dependencies_1.RepositoryService.findAll(dependencies_1.RepositoryService.entities.Skill);
});
exports.getAllSkills = getAllSkills;
const addNewSkill = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Skill_1.Skill.create(dependencies_1.RepositoryService, data);
});
exports.addNewSkill = addNewSkill;
const deleteSkill = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield (yield Skill_1.Skill.load(dependencies_1.RepositoryService, data)).remove(dependencies_1.RepositoryService); });
exports.deleteSkill = deleteSkill;
const updateSkill = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (yield Skill_1.Skill.load(dependencies_1.RepositoryService, { uuid: data.uuid })).update(dependencies_1.RepositoryService, data);
});
exports.updateSkill = updateSkill;
