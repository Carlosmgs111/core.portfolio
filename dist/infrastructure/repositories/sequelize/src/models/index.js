"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JoinTableFactory_1 = require("./JoinTableFactory");
const User_1 = require("./User");
const Project_1 = require("./Project");
const Institution_1 = require("./Institution");
const Certification_1 = require("./Certification");
const Post_1 = require("./Post");
const Skill_1 = require("./Skill");
const models = Object.assign(Object.assign(Object.assign({ User: User_1.User,
    Project: Project_1.Project,
    Institution: Institution_1.Institution,
    Certification: Certification_1.Certification,
    Post: Post_1.Post,
    Skill: Skill_1.Skill }, (0, JoinTableFactory_1.JoinTableFactory)("User", "Institution")), (0, JoinTableFactory_1.JoinTableFactory)("User", "Certification")), (0, JoinTableFactory_1.JoinTableFactory)("User", "Skill"));
console.log({ models });
exports.default = models;
