"use strict";
const {
  project_table,
  project_schema,
} = require("../dist/models/Project");


module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.removeColumn(
      project_table,
      "description"
    );
  },

  async down(queryInterface, Sequelize) {},
};
