"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const __1 = require("..");
const User_1 = require("./User");
const Project_1 = require("./Project");
const Institution_1 = require("./Institution");
const Certification_1 = require("./Certification");
const Post_1 = require("./Post");
const Skill_1 = require("./Skill");
const createJoinTable = (A, B) => {
    A = A.tableName || A;
    B = B.tableName || B;
    const join_table_name = `${(0, utils_1.labelCases)(A).CP}_${(0, utils_1.labelCases)(B).CP}`;
    const join_table_schema = {
        uuid: {
            primaryKey: true,
            allowNull: false,
            unique: true,
            type: sequelize_1.DataTypes.STRING,
        },
        [`${(0, utils_1.labelCases)(A).LS}UUID`]: {
            field: `${(0, utils_1.labelCases)(A).LS}_uuid`,
            unique: false,
            allowNull: false,
            type: sequelize_1.DataTypes.STRING,
            references: {
                model: (0, utils_1.labelCases)(A).CP,
                key: "uuid",
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION",
            },
        },
        [`${(0, utils_1.labelCases)(B).LS}UUID`]: {
            field: `${(0, utils_1.labelCases)(B).LS}_uuid`,
            unique: false,
            allowNull: false,
            type: sequelize_1.DataTypes.STRING,
            references: {
                model: (0, utils_1.labelCases)(B).CP,
                key: "uuid",
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION",
            },
        },
    };
    return {
        [join_table_name]: __1.sequelize.define(join_table_name, join_table_schema, {
            createdAt: false,
            updatedAt: false,
        }),
    };
};
const models = Object.assign(Object.assign(Object.assign({ User: User_1.User,
    Project: Project_1.Project,
    Institution: Institution_1.Institution,
    Certification: Certification_1.Certification,
    Post: Post_1.Post,
    Skill: Skill_1.Skill }, createJoinTable(User_1.User, Institution_1.Institution)), createJoinTable(User_1.User, Certification_1.Certification)), createJoinTable(User_1.User, Skill_1.Skill));
console.log(String(models.Users_Certifications.tableName));
exports.default = models;
