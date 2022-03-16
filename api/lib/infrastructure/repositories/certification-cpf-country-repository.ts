// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCpfCountry = require('../../domain/models/CertificationCpfCountry');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getByMatcher({
    matcher
  }: any) {
    const COLUMNS = ['id', 'code', 'commonName', 'originalName', 'matcher'];

    const result = await knex.select(COLUMNS).from('certification-cpf-countries').where({ matcher }).first();

    if (!result) {
      return null;
    }

    return new CertificationCpfCountry(result);
  },
};
