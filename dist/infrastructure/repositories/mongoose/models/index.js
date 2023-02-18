"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = __importDefault(require("../../../../projects/insfrastructure/repositories/mongoose/Project"));
const User_1 = __importDefault(require("../../../../users/infrastructure/repositories/mongoose/User"));
const Certification_1 = __importDefault(require("../../../../certifications/infrastructure/repositories/mongoose/Certification"));
const Institution_1 = __importDefault(require("../../../../institutions/infrastructure/repositories/mongoose/Institution"));
const Post_1 = __importDefault(require("../../../../posts/insfrasctructure/repositories/mongoose/Post"));
const Skill_1 = __importDefault(require("./Skill"));
const Note_1 = __importDefault(require("./Note"));
const models = {
    Project: Project_1.default,
    User: User_1.default,
    Certification: Certification_1.default,
    Institution: Institution_1.default,
    Post: Post_1.default,
    Skill: Skill_1.default,
    Note: Note_1.default,
};
exports.default = models;
