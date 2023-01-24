'use strict';
const {user_certification_table, user_certification_schema}=require("../dist/models/User_Certification")
const {user_institution_table, user_institution_schema}=require("../dist/models/User_Institution")
// const {certification_institution_table, certification_institution_schema}=require("../dist/models/Certification_Institution")

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable(user_certification_table, user_certification_schema);
    queryInterface.createTable(user_institution_table, user_institution_schema);
    // queryInterface.createTable(certification_institution_table, certification_institution_schema);
  },

  async down (queryInterface, Sequelize) {
  }
};
