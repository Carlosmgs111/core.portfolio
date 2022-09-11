'use strict';
const {user_table, user_schema}=require("../dist/models/User")
const {project_table, project_schema}=require("../dist/models/Project")

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn(project_table, "user_id", "user_uuid")
  },

  async down (queryInterface, Sequelize) {
  }
};
