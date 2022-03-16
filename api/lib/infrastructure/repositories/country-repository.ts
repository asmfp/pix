// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Country'.
const { Country } = require('../../domain/read-models/Country');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findAll() {
    const result = await knex
      .from('certification-cpf-countries')
      .select('commonName', 'code', 'matcher')
      .where('commonName', '=', knex.ref('originalName'))
      .orderBy('commonName', 'asc');

    return result.map(_toDomain);
  },
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(row: any) {
  return new Country({
    ...row,
    name: row.commonName,
  });
}
