"use strict";
const { user_table, user_schema } = require("../dist/models/User");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(user_table, "uuid", user_schema.uuid);
    await queryInterface.changeColumn(user_table, "username", user_schema.username);
    await queryInterface.changeColumn(user_table, "email", user_schema.email);
    await queryInterface.changeColumn(user_table, "paswword", user_schema.password);
    await queryInterface.changeColumn(user_table, "createdAt", user_schema.createdAt);
    await queryInterface.renameColumn(user_table, "createdAt", "created_at")
    await queryInterface.changeColumn(user_table, "updatedAt", user_schema.updatedAt);
    await queryInterface.renameColumn(user_table, "updatedAt", "updated_at")
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(user_table, 'role');
  },
};