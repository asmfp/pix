const TABLE_NAME = 'campaign-participations';
const SCHOOLINGREGISTRATIONID_COLUMN = 'schoolingRegistrationId';

exports.up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.index(SCHOOLINGREGISTRATIONID_COLUMN);
  });
};

exports.down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropIndex(SCHOOLINGREGISTRATIONID_COLUMN);
  });
};
