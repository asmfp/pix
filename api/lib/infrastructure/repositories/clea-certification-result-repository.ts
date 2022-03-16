// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CleaCertif... Remove this comment to see the full error message
const CleaCertificationResult = require('../../../lib/domain/models/CleaCertificationResult');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
const { PIX_EMPLOI_CLEA, PIX_EMPLOI_CLEA_V2 } = require('../../domain/models/Badge').keys;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get({
    certificationCourseId
  }: any) {
    const result = await knex
      .select('acquired')
      .from('partner-certifications')
      .where({ certificationCourseId })
      .whereIn('partnerKey', [PIX_EMPLOI_CLEA, PIX_EMPLOI_CLEA_V2])
      .first();

    if (!result) {
      return CleaCertificationResult.buildNotTaken();
    }
    return CleaCertificationResult.buildFrom(result);
  },
};
