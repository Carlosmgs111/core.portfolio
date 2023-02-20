"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableSchemas = exports.tableNames = exports.models = void 0;
const utils_1 = require("../../../../../utils");
const sequelize_1 = require("sequelize");
const src_1 = require("../../../../../services/DatabaseServices/SequelizeAdapter/infrastructure/src");
// * Models import
const sequelize_2 = require("../../../../../modules/users/models/sequelize");
const sequelize_3 = require("../../../../../modules/projects/models/sequelize");
const sequelize_4 = require("../../../../../modules/institutions/models/sequelize");
const sequelize_5 = require("../../../../../modules/certifications/models/sequelize");
const sequelize_6 = require("../../../../../modules/posts/models/sequelize");
const sequelize_7 = require("../../../../../modules/skills/models/sequelize");
const sequelize_8 = require("../../../../../modules/notes/models/sequelize");
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
        [join_table_name]: src_1.sequelize.define(join_table_name, join_table_schema, {
            createdAt: false,
            updatedAt: false,
        }),
    };
};
exports.models = Object.assign(Object.assign(Object.assign(Object.assign({ User: sequelize_2.User,
    Project: sequelize_3.Project,
    Institution: sequelize_4.Institution,
    Certification: sequelize_5.Certification,
    Post: sequelize_6.Post,
    Skill: sequelize_7.Skill,
    Note: sequelize_8.Note }, createJoinTable(sequelize_2.User, sequelize_4.Institution)), createJoinTable(sequelize_2.User, sequelize_5.Certification)), createJoinTable(sequelize_2.User, sequelize_7.Skill)), createJoinTable(sequelize_2.User, sequelize_3.Project));
exports.tableNames = Object.assign({ institution_table: sequelize_4.institution_table,
    user_table: sequelize_2.user_table,
    certification_table: sequelize_5.certification_table,
    skill_table: sequelize_7.skill_table,
    project_table: sequelize_3.project_table,
    post_table: sequelize_6.post_table,
    note_table: sequelize_8.note_table }, joinTableNames);
exports.tableSchemas = Object.assign({ institution_schema: sequelize_4.institution_schema,
    certification_schema: sequelize_5.certification_schema,
    user_schema: sequelize_2.user_schema,
    skill_schema: sequelize_7.skill_schema,
    project_schema: sequelize_3.project_schema,
    post_schema: sequelize_6.post_schema,
    note_schema: sequelize_8.note_schema }, joinTableSchema);
// export default models;
