'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        first_name: 'Admin',
        last_name: 'MadeCorec',
        email: 'admin@madecorec.com',
        password: hashedPassword,
        phone: '+593999999999',
        address: 'Dirección Admin',
        city: 'Quito',
        country: 'Ecuador',
        role: 'ADMIN',
        is_active: true,
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create cart for admin user
    await queryInterface.bulkInsert('carts', [
      {
        id: 1,
        user_id: 1,
        total_items: 0,
        subtotal: 0.00,
        last_activity: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carts', { user_id: 1 }, {});
    await queryInterface.bulkDelete('users', { email: 'admin@madecorec.com' }, {});
  }
};