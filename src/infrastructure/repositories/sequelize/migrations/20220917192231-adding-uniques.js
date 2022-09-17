'use strict';
const {certification_table, certification_schema}=require("../dist/models/Certification")
const {project_table, project_schema}=require("../dist/models/Project")
const {institution_table, institution_schema}=require("../dist/models/Institution")

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn(certification_table, "title", certification_schema.title)
    await queryInterface.changeColumn(certification_table, "image", certification_schema.image)
    await queryInterface.changeColumn(institution_table, "name", institution_schema.name)
    await queryInterface.changeColumn(institution_table, "businessName", institution_schema.businessName)
    await queryInterface.changeColumn(project_table, "name", project_schema.name)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
