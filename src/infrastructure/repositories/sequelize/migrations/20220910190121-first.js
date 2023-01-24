"use strict";
const { user_table, user_schema } = require("../dist/models/User");
const { project_table, project_schema } = require("../dist/models/Project");
const { post_table, post_schema } = require("../dist/models/Post");
const {
  certification_table,
  certification_schema,
} = require("../dist/models/Certification");
const {
  institution_table,
  institution_schema,
} = require("../dist/models/Institution");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(user_table, user_schema);
    await queryInterface.createTable(institution_table, institution_schema);
    await queryInterface.createTable(project_table, project_schema);
    await queryInterface.createTable(post_table, post_schema);
    await queryInterface.createTable(certification_table, certification_schema);
  },

  async down(queryInterface, Sequelize) {},
};
