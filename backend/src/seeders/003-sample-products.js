'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        id: 1,
        name: 'Sofá 3 Puestos Moderno',
        description: 'Elegante sofá de 3 puestos tapizado en tela de alta calidad',
        short_description: 'Sofá moderno y cómodo para sala',
        sku: 'SOFA-3P-MOD-001',
        price: 650.00,
        compare_price: 750.00,
        cost_price: 400.00,
        stock_quantity: 15,
        min_stock_level: 3,
        weight: 45.50,
        dimensions: '200x80x85 cm',
        images: JSON.stringify([
          'https://example.com/sofa1.jpg',
          'https://example.com/sofa2.jpg'
        ]),
        category_id: 1,
        status: 'ACTIVE',
        is_featured: true,
        meta_title: 'Sofá 3 Puestos Moderno - MadeCorec',
        meta_description: 'Sofá moderno de 3 puestos, ideal para sala de estar',
        slug: 'sofa-3-puestos-moderno',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Mesa de Comedor Rectangular',
        description: 'Mesa de comedor de madera maciza para 6 personas',
        short_description: 'Mesa rectangular para comedor',
        sku: 'MESA-COM-RECT-001',
        price: 420.00,
        compare_price: 500.00,
        cost_price: 280.00,
        stock_quantity: 8,
        min_stock_level: 2,
        weight: 35.00,
        dimensions: '180x90x75 cm',
        images: JSON.stringify([
          'https://example.com/mesa1.jpg'
        ]),
        category_id: 2,
        status: 'ACTIVE',
        is_featured: true,
        meta_title: 'Mesa de Comedor Rectangular - MadeCorec',
        meta_description: 'Mesa de comedor rectangular de madera para 6 personas',
        slug: 'mesa-comedor-rectangular',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Cama Queen Size con Cabecera',
        description: 'Cama queen size con elegante cabecera tapizada',
        short_description: 'Cama queen con cabecera',
        sku: 'CAMA-QUEEN-CAB-001',
        price: 380.00,
        compare_price: 450.00,
        cost_price: 250.00,
        stock_quantity: 12,
        min_stock_level: 2,
        weight: 55.00,
        dimensions: '160x200x120 cm',
        images: JSON.stringify([
          'https://example.com/cama1.jpg',
          'https://example.com/cama2.jpg'
        ]),
        category_id: 3,
        status: 'ACTIVE',
        is_featured: false,
        meta_title: 'Cama Queen Size con Cabecera - MadeCorec',
        meta_description: 'Cama queen size con cabecera tapizada elegante',
        slug: 'cama-queen-size-cabecera',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'Escritorio Ejecutivo',
        description: 'Escritorio ejecutivo de madera con cajones',
        short_description: 'Escritorio para oficina',
        sku: 'ESC-EJEC-MAD-001',
        price: 290.00,
        compare_price: 350.00,
        cost_price: 180.00,
        stock_quantity: 6,
        min_stock_level: 1,
        weight: 28.00,
        dimensions: '140x70x75 cm',
        images: JSON.stringify([
          'https://example.com/escritorio1.jpg'
        ]),
        category_id: 4,
        status: 'ACTIVE',
        is_featured: false,
        meta_title: 'Escritorio Ejecutivo - MadeCorec',
        meta_description: 'Escritorio ejecutivo de madera ideal para oficina',
        slug: 'escritorio-ejecutivo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        name: 'Espejo Decorativo Redondo',
        description: 'Espejo decorativo redondo con marco dorado',
        short_description: 'Espejo decorativo redondo',
        sku: 'ESP-DEC-RED-001',
        price: 85.00,
        compare_price: 120.00,
        cost_price: 45.00,
        stock_quantity: 20,
        min_stock_level: 5,
        weight: 3.50,
        dimensions: '60x60x3 cm',
        images: JSON.stringify([
          'https://example.com/espejo1.jpg'
        ]),
        category_id: 5,
        status: 'ACTIVE',
        is_featured: true,
        meta_title: 'Espejo Decorativo Redondo - MadeCorec',
        meta_description: 'Espejo decorativo redondo con marco dorado',
        slug: 'espejo-decorativo-redondo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};