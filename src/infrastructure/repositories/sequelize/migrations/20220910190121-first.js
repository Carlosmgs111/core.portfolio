"use strict";
const { user_table, user_schema } = require("../dist/models/User");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(user_table, user_schema);
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.removeTable(user_table);
  },
};