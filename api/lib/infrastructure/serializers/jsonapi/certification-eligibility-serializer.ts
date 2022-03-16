// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificationEligibility: any) {
    return new Serializer('isCertifiables', {
      transform(certificationEligibility: any) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        const clone = Object.assign({}, certificationEligibility);
        clone.isCertifiable = clone.pixCertificationEligible;
        return clone;
      },
      attributes: [
        'isCertifiable',
        'cleaCertificationEligible',
        'pixPlusDroitMaitreCertificationEligible',
        'pixPlusDroitExpertCertificationEligible',
        'pixPlusEduInitieCertificationEligible',
        'pixPlusEduConfirmeCertificationEligible',
        'pixPlusEduAvanceCertificationEligible',
        'pixPlusEduExpertCertificationEligible',
      ],
    }).serialize(certificationEligibility);
  },
};
