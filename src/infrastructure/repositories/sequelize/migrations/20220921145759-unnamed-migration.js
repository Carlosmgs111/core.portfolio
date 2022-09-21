"use strict";
const {
  user_certification_table,
  user_certification_schema,
} = require("../dist/models/User_Certification");

module.exports = {
  async up(queryInterface, Sequelize) {
    /* await queryInterface.changeColumn(
      user_certification_table,
      "user_uuid",
      user_certification_schema.userUUID
    );
    await queryInterface.changeColumn(
      user_certification_table,
      "institution_uuid",
      user_certification_schema.certificationUUID
    ); */
    await queryInterface.dropTable(user_certification_table)
    await queryInterface.createTable(user_certification_table, user_certification_schema)
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
