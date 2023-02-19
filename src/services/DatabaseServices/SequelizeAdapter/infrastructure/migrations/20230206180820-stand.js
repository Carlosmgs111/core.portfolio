"use strict";

const { query } = require("express");
const models = require("../dist/models");
const {
  tableSchemas: {
    user_schema,
    certification_schema,
    project_schema,
    institution_schema,
    post_schema,
    skill_schema,
    note_schema,
    users_certifications_schema,
    users_institutions_schema,
    users_skills_schema,
    users_projects_schema,
  },
  tableNames: {
    user_table,
    certification_table,
    project_table,
    institution_table,
    post_table,
    skill_table,
    note_table,
    users_certifications_table,
    users_institutions_table,
    users_projects_table,
    users_skills_table,
  },
} = models;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
    await queryInterface.createTable(note_table, note_schema);
  },

  async down(queryInterface, Sequelize) {},
};
