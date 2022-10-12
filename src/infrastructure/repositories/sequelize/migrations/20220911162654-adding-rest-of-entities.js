"use strict";
const { project_table, project_schema } = require("../dist/models/Project");
const { blog_table, blog_schema } = require("../dist/models/Blog");
const {
  certification_table,
  certification_schema,
} = require("../dist/models/Certification");

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable(project_table, project_schema);
    queryInterface.createTable(blog_table, blog_schema);
    queryInterface.createTable(certification_table, certification_schema);
  },

  async down(queryInterface, Sequelize) {}
};
