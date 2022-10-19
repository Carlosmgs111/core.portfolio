"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./User");
const Project_1 = require("./Project");
const Institution_1 = require("./Institution");
const Certification_1 = require("./Certification");
const Post_1 = require("./Post");
const Skill_1 = require("./Skill");
const User_Institution_1 = require("./User_Institution");
const User_Certification_1 = require("./User_Certification");
const models = {
    User: User_1.User,
    Project: Project_1.Project,
    Institution: Institution_1.Institution,
    Certification: Certification_1.Certification,
    Post: Post_1.Post,
    Skill: Skill_1.Skill,
    Users_Institutions: User_Institution_1.Users_Institutions,
    Users_Certifications: User_Certification_1.Users_Certifications,
};
exports.default = models;
