/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('advertisements', {
    id: {type: 'uuid', primaryKey: true},
    seller_id: {type: 'int', notNull: true},
    is_active: {type: 'boolean', notNull: true},
    start_date_time: {type: 'timestamp with time zone', notNull: true},
    end_date_time: {type: 'timestamp with time zone', notNull: true},
  });

  pgm.createTable('advertisement_products', {
    advertisement_id: {type: 'uuid', notNull: true},
    product_id: {type: 'int', notNull: true},
  });

  pgm.sql(`
    CREATE INDEX "idx_advertisement_products_advertisement_id_and_product_id" ON "advertisement_products" ("advertisement_id", "product_id");
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP INDEX "idx_advertisement_products_advertisement_id_and_product_id"
  `);
};
