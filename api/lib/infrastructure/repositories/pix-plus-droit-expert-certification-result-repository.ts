// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PixPlusDro... Remove this comment to see the full error message
const PixPlusDroitExpertCertificationResult = require('../../../lib/domain/models/PixPlusDroitExpertCertificationResult');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
const { PIX_DROIT_EXPERT_CERTIF } = require('../../../lib/domain/models/Badge').keys;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get({
    certificationCourseId
  }: any) {
    const result = await knex
      .select('acquired')
      .from('partner-certifications')
      .where({ certificationCourseId, partnerKey: PIX_DROIT_EXPERT_CERTIF })
      .first();

    if (!result) {
      return PixPlusDroitExpertCertificationResult.buildNotTaken();
    }
    return PixPlusDroitExpertCertificationResult.buildFrom(result);
  },
};
