'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // queryInterface.renameTable("Blogs", "Posts")
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
