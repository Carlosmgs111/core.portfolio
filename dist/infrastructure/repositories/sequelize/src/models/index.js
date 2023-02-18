"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableSchemas = exports.tableNames = void 0;
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const __1 = require("..");
// * Models import
const User_1 = require("../../../../../users/infrastructure/repositories/sequelize/User");
const Project_1 = require("../../../../../projects/insfrastructure/repositories/sequelize/Project");
const Institution_1 = require("../../../../../institutions/infrastructure/repositories/sequelize/Institution");
const Certification_1 = require("../../../../../certifications/infrastructure/repositories/sequelize/Certification");
const Post_1 = require("../../../../../posts/insfrasctructure/repositories/sequelize/Post");
const Skill_1 = require("../../../../../skills/infrastructure/repositories/sequelize/Skill");
const Note_1 = require("../../../../../notes/insfrastructure/repositories/sequelize/Note");
const joinTableNames = {};
const joinTableSchema = {};
const createJoinTable = (A, B) => {
    A = A.tableName || A;
    B = B.tableName || B;
    const join_table_name = `${(0, utils_1.labelCases)(A).CP}_${(0, utils_1.labelCases)(B).CP}`;
    joinTableNames[`${(0, utils_1.labelCases)(join_table_name).LP}_table`] = join_table_name;
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
    joinTableSchema[`${(0, utils_1.labelCases)(join_table_name).LP}_schema`] =
        join_table_schema;
    return {
        [join_table_name]: __1.sequelize.define(join_table_name, join_table_schema, {
            createdAt: false,
            updatedAt: false,
        }),
    };
};
const models = Object.assign(Object.assign(Object.assign(Object.assign({ User: User_1.User,
    Project: Project_1.Project,
    Institution: Institution_1.Institution,
    Certification: Certification_1.Certification,
    Post: Post_1.Post,
    Skill: Skill_1.Skill,
    Note: Note_1.Note }, createJoinTable(User_1.User, Institution_1.Institution)), createJoinTable(User_1.User, Certification_1.Certification)), createJoinTable(User_1.User, Skill_1.Skill)), createJoinTable(User_1.User, Project_1.Project));
exports.tableNames = Object.assign({ institution_table: Institution_1.institution_table,
    user_table: User_1.user_table,
    certification_table: Certification_1.certification_table,
    skill_table: Skill_1.skill_table,
    project_table: Project_1.project_table,
    post_table: Post_1.post_table,
    note_table: Note_1.note_table }, joinTableNames);
exports.tableSchemas = Object.assign({ institution_schema: Institution_1.institution_schema,
    certification_schema: Certification_1.certification_schema,
    user_schema: User_1.user_schema,
    skill_schema: Skill_1.skill_schema,
    project_schema: Project_1.project_schema,
    post_schema: Post_1.post_schema,
    note_schema: Note_1.note_schema }, joinTableSchema);
exports.default = models;
