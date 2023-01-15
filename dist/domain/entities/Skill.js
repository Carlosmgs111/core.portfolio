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
exports.Skill = void 0;
const uuid_1 = require("uuid");
class Skill {
    constructor({ uuid, userUUID, name, description, image, tags }) {
        this.createdAt = 0;
        this.updatedAt = 0;
        this.remove = (RepositoryService) => __awaiter(this, void 0, void 0, function* () {
            return yield RepositoryService.removeOne(RepositoryService.entities.Skill, {
                credentials: { uuid: this.uuid },
            });
        });
        this.update = (RepositoryService, data) => __awaiter(this, void 0, void 0, function* () {
            this.updatedAt = new Date().getTime();
            return yield RepositoryService.updateOne(RepositoryService.entities.Skill, Object.assign(Object.assign({}, this), data), { credentials: { uuid: this.uuid } });
        });
        this.uuid = uuid;
        this.userUUID = userUUID;
        this.name = name;
        this.description = description;
        this.image = image;
        this.tags = tags;
        this.createdAt = new Date().getTime();
        this.updatedAt = new Date().getTime();
    }
}
exports.Skill = Skill;
_a = Skill;
Skill.create = (RepositoryService, data) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = (0, uuid_1.v4)();
    const skill = new Skill(Object.assign(Object.assign({}, data), { uuid, userUUID: data.user.uuid }));
    return yield RepositoryService.createOne(RepositoryService.entities.Skill, skill);
});
Skill.load = (RepositoryService, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield Skill.find(RepositoryService, credentials);
    console.log({ Model: RepositoryService.Model, credentials });
    if (!skill)
        throw new Error("Incorrect credentials!");
    const loadedSkill = new Skill(skill);
    return loadedSkill;
});
Skill.find = (RepositoryService, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield RepositoryService.findOne(RepositoryService.entities.Skill, {
        credentials,
    });
    return skill;
});
