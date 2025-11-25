'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'supplierId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Suppliers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'supplierId');
  }
};