"use strict";
const { project_table, project_schema } = require("../dist/models/Project");
const { blog_table, blog_schema } = require("../dist/models/Blog");
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
    queryInterface.createTable(project_table, project_schema);
    queryInterface.createTable(blog_table, blog_schema);
    queryInterface.createTable(certification_table, certification_schema);
    queryInterface.createTable(institution_table, institution_schema);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable(project_table);
    queryInterface.dropTable(blog_table);
    queryInterface.dropTable(certification_table);
    queryInterface.dropTable(institution_table);
  },
};
