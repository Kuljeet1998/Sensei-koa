
exports.up = function(knex) {
  return knex.schema
    .createTable('User', function (table) {
       table.uuid('id').primary();
       table.string('username', 255).notNullable();
       table.string('password', 255).notNullable();
    })
};
/*    .createTable('Token', function (table) {
       table.string('key', 255).primary();
       table.string('user_id', 255).references('id').inTable('User')
    });
};*/

exports.down = function(knex) {
   return knex.schema
      .dropTable("User")
/*      .dropTable("Token");*/
};

exports.config = { transaction: false };