
exports.up = function(knex) {
  return knex.schema
    .createTable('Attachment', function (table) {
       table.uuid('id').primary();
       table.string('name', 255).notNullable();
       table.string('path', 500);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
    })
    .createTable('Account', function (table) {
       table.uuid('id').primary();
       table.string('name', 255).notNullable();
       table.string('description', 500);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('attachment_id', 255).references('id').inTable('Attachment').unique('attachment_id');
       table.string('app_url', 500);
    })
    .createTable('RatingScheme', function (table) {
       table.uuid('id').primary();
       table.string('name', 255).notNullable();
       table.string('description', 500);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.string('code', 500);
       table.boolean('is_input_required').defaultTo(false);
    })
    .createTable('Rating', function (table) {
       table.uuid('id').primary();
       table.string('name', 255).notNullable();
       table.string('description', 500);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.integer('score');
       table.uuid('rating_scheme_id', 255).references('id').inTable('RatingScheme');
       table.uuid('account_id', 255).references('id').inTable('Account');
    })
    .createTable('Rubric', function (table) {
       table.uuid('id').primary();
       table.string('name', 255).notNullable();
       table.string('description', 500);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('account_id', 255).references('id').inTable('Account');
       table.uuid('rating_scheme_id', 255).references('id').inTable('RatingScheme');
       table.boolean('is_archived').defaultTo(false);
       table.boolean('is_dummy').defaultTo(false);
    })
    .createTable('Group', function (table) {
       table.uuid('id').primary();
       table.string('name', 255).notNullable();
       table.string('description', 500);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('account_id', 255).references('id').inTable('Account');
       table.uuid('created_by', 255).references('id').inTable('User');
       table.uuid('rubric_id', 255).references('id').inTable('Rubric');
       table.boolean('is_dummy').defaultTo(false);
    })
    .createTable('Observation', function (table) {
       table.uuid('id').primary();
       table.string('name', 255).notNullable();
       table.string('description', 500);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('rubric_id', 255).references('id').inTable('Rubric');
       table.uuid('group_id', 255).references('id').inTable('Group');
       table.uuid('observer_id', 255).references('id').inTable('User');
       table.uuid('observee_id', 255).references('id').inTable('User');
       table.boolean('is_published').defaultTo(false);
    })
    .createTable('Evidence', function (table) {
       table.uuid('id').primary();
       table.string('name', 255).notNullable();
       table.string('description', 500);
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('observation', 255).references('id').inTable('Observation');
       table.boolean('is_observers_learning').defaultTo(false);
    })
    .createTable('IndicatorRating', function (table) {
       table.uuid('id').primary();
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('indicator_id', 255).references('id').inTable('indicator');
       table.uuid('evidence_id', 255).references('id').inTable('Evidence');
       table.uuid('rating_id', 255).references('id').inTable('Rating');
    })
    .createTable('rubric_indicators', function (table) {
       table.uuid('id').primary();
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('indicator_id', 255).references('id').inTable('indicator');
       table.uuid('rubric_id', 255).references('id').inTable('Rubric');
    })
    .createTable('group_users', function (table) {
       table.uuid('id').primary();
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('group_id', 255).references('id').inTable('Group');
       table.uuid('user_id', 255).references('id').inTable('User');
    })
    .createTable('evidence_indicators', function (table) {
       table.uuid('id').primary();
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('indicator_id', 255).references('id').inTable('indicator');
       table.uuid('evidence_id', 255).references('id').inTable('Evidence');
    })
    .createTable('evidence_attachments', function (table) {
       table.uuid('id').primary();
       table.datetime('created', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.datetime('updated', { precision: 6 }).defaultTo(knex.fn.now(6));
       table.uuid('evidence_id', 255).references('id').inTable('Evidence');
       table.uuid('attachment_id', 255).references('id').inTable('Attachment');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable("Attachment")
    .dropTable("Account")
    .dropTable("RatingScheme")
    .dropTable("Rating")
    .dropTable("Rubric")
    .dropTable("Group")
    .dropTable("Observation")
    .dropTable("Evidence")
    .dropTable("IndicatorRating")
    .dropTable("rubric_indicators")
    .dropTable("group_users")
    .dropTable("evidence_indicators")
    .dropTable("evidence_attachments")
};
