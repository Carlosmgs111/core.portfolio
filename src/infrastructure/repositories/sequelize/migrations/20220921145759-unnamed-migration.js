"use strict";
const {
  user_institution_table,
  user_institution_schema,
} = require("../dist/models/User_Institution");
const {
  user_certification_table,
  user_certification_schema,
} = require("../dist/models/User_Certification");
const { post_table, post_schema } = require("../dist/models/Post");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      user_institution_table,
      user_institution_schema
    );
    await queryInterface.createTable(
      user_certification_table,
      user_certification_schema
    );
    await queryInterface.createTable(post_table, post_schema);
  },

  async down(queryInterface, Sequelize) {},
};
