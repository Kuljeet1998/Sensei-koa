
exports.up = function(knex) {
    return knex.schema
    .table('Attachment', function (table) {
    table.string('thumbnail_path',500);
    });
};

exports.down = function(knex) {
    return knex.schema
      .dropTable("Attachment")
};
