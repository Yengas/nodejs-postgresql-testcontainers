/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('advertisements', {
    id: {type: 'uuid', primaryKey: true},
    seller_id: {type: 'int', notNull: true},
    is_active: {type: 'boolean', notNull: true},
    start_date_time: {type: 'timestamp', notNull: true},
    end_date_time: {type: 'timestamp', notNull: true},
  });
};
