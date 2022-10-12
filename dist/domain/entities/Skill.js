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
    constructor({ uuid, userUUID, name, description, image, }) {
        this.createdAt = 0;
        this.updatedAt = 0;
        this.remove = (DatabaseServices) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupModel("Skill");
            return yield DatabaseServices.remove(this);
        });
        this.update = (DatabaseServices, data) => __awaiter(this, void 0, void 0, function* () {
            DatabaseServices.setupModel("Skill");
            this.updatedAt = new Date().getTime();
            return yield DatabaseServices.update(Object.assign(Object.assign({}, this), data));
        });
        this.uuid = uuid;
        this.userUUID = userUUID;
        this.name = name;
        this.description = description;
        this.image = image;
        this.createdAt = new Date().getTime();
        this.updatedAt = new Date().getTime();
    }
}
exports.Skill = Skill;
_a = Skill;
Skill.new = (DatabaseServices, data) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("Skill");
    const uuid = (0, uuid_1.v4)();
    const account = new Skill(Object.assign(Object.assign({}, data), { uuid, userUUID: data.user.uuid }));
    return yield DatabaseServices.create(account);
});
Skill.load = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("Skill");
    const skill = yield Skill.find(DatabaseServices, credentials);
    console.log({ Model: DatabaseServices.Model, credentials });
    if (!skill)
        throw new Error("Incorrect credentials!");
    const account = new Skill(skill);
    return account;
});
Skill.find = (DatabaseServices, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    DatabaseServices.setupModel("Skill");
    const { uuid } = credentials;
    const account = yield DatabaseServices.findOne({
        uuid,
    });
    return account;
});
