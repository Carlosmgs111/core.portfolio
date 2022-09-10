"use strict";
const { user_table, user_schema } = require("../dist/models/User");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(user_table, "role", user_schema.role);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(user_table, 'role');
  },
};