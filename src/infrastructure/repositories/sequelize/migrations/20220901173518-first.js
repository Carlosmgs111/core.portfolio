"use strict";
const { user_table, user_schema } = require("../models/User");
console.log({ user_table, user_schema });
console.log(user_schema.username)

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(user_table, "role", user_schema.role);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
