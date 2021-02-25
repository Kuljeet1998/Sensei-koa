
exports.up = function(knex) {
  return knex.schema
    .createTable('proposition', function (table) {
       table.uuid('id').primary();
       table.string('title', 255).notNullable();
       table.string('description', 500);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
    })
    .createTable('subproposition', function (table) {
       table.uuid('id').primary();
       table.string('title', 255).notNullable();
       table.string('description', 500);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
    })
    .createTable('tag', function (table) {
       table.uuid('id').primary();
       table.string('title', 255).notNullable();
       table.string('description', 500);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
   })
    .createTable('type', function (table) {
       table.uuid('id').primary();
       table.string('title', 255).notNullable();
       table.string('slug', 255);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
   })
    .createTable('indicator', function (table) {
       table.uuid('id').primary();
       table.string('title', 255).notNullable();
       table.string('description', 500);
       table.boolean('is_archived').defaultTo(false);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
   })
    .createTable('indicator_tags', function (table) {
       table.uuid('id').primary();
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('indicator_id', 255).references('id').inTable('indicator');
       table.uuid('tag_id', 255).references('id').inTable('tag');
   })
    .createTable('indicator_propositions', function (table) {
       table.uuid('id').primary();
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('indicator_id', 255).references('id').inTable('indicator');
       table.uuid('proposition_id', 255).references('id').inTable('proposition');
   })
    .createTable('indicator_subpropositions', function (table) {
       table.uuid('id').primary();
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('indicator_id', 255).references('id').inTable('indicator');
       table.uuid('subproposition_id', 255).references('id').inTable('subproposition');
   })
    .createTable('indicator_types', function (table) {
       table.uuid('id').primary();
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('indicator_id', 255).references('id').inTable('indicator');
       table.uuid('type_id', 255).references('id').inTable('type');
   });
};

exports.down = function(knex) {
  return knex.schema
      .dropTable("proposition")
      .dropTable("subproposition")
      .dropTable("tag")
      .dropTable("type")
      .dropTable("indicator")
      .dropTable("indicator_tags")
      .dropTable("indicator_propositions")
      .dropTable("indicator_subpropositions")
      .dropTable("indicator_types");
};
