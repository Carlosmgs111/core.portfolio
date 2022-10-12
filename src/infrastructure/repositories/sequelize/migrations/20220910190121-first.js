"use strict";
const { user_table, user_schema } = require("../dist/models/User");
const {
  institution_table,
  institution_schema,
} = require("../dist/models/Institution");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(user_table, user_schema);
    await queryInterface.createTable(institution_table, institution_schema);
  },

  async down(queryInterface, Sequelize) {
  },
};