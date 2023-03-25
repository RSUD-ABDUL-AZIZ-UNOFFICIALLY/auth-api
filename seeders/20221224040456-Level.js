'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Levels', [
      {
      id: 1,
      access: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
      {
      id: 2,
      access: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      access: 'dokter',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      access: 'kepala-ruangan',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      access: 'perawat',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      access: 'staff',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      access: 'server',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
