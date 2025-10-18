'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'Sala',
        description: 'Muebles para sala de estar',
        slug: 'sala',
        image_url: null,
        is_active: true,
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Comedor',
        description: 'Muebles para comedor',
        slug: 'comedor',
        image_url: null,
        is_active: true,
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Dormitorio',
        description: 'Muebles para dormitorio',
        slug: 'dormitorio',
        image_url: null,
        is_active: true,
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'Oficina',
        description: 'Muebles para oficina',
        slug: 'oficina',
        image_url: null,
        is_active: true,
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        name: 'Decoración',
        description: 'Artículos decorativos',
        slug: 'decoracion',
        image_url: null,
        is_active: true,
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};