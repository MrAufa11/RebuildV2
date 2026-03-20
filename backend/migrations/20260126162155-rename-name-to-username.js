'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Parameter: namaTable, namaKolomLama, namaKolomBaru
    await queryInterface.renameColumn('Users', 'name', 'username');
  },

  async down(queryInterface, Sequelize) {
    // Revert perubahan jika di-undo
    await queryInterface.renameColumn('Users', 'username', 'name');
  }
};
