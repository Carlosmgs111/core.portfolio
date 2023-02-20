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
const models_1 = require("../models");
const { user_schema, certification_schema, project_schema, institution_schema, post_schema, skill_schema, note_schema, users_certifications_schema, users_institutions_schema, users_skills_schema, users_projects_schema, } = models_1.tableSchemas;
const { user_table, certification_table, project_table, institution_table, post_table, skill_table, note_table, users_certifications_table, users_institutions_table, users_projects_table, users_skills_table, } = models_1.tableNames;
module.exports = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log({ models });
            // await queryInterface.createTable(user_table, user_schema);
            // await queryInterface.createTable(institution_table, institution_schema);
            // await queryInterface.createTable(certification_table, certification_schema);
            // await queryInterface.createTable(project_table, project_schema);
            // await queryInterface.createTable(post_table, post_schema);
            // await queryInterface.createTable(skill_table, skill_schema);
            // await queryInterface.createTable(
            //   users_certifications_table,
            //   users_certifications_schema
            // );
            // await queryInterface.createTable(
            //   users_institutions_table,
            //   users_institutions_schema
            // );
            // await queryInterface.createTable(
            //   users_projects_table,
            //   users_projects_schema
            // );
            // await queryInterface.createTable(users_skills_table, users_skills_schema);
            // await queryInterface.removeColumn(project_table, "user_uuid");
            yield queryInterface.createTable(note_table, note_schema);
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () { });
    },
};
