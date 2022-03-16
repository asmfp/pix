// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PartnerCer... Remove this comment to see the full error message
const PartnerCertificationScoring = require('./PartnerCertificationScoring');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PixPlusEdu... Remove this comment to see the full error message
class PixPlusEduCertificationScoring extends PartnerCertificationScoring {
  hasAcquiredPixCertification: any;
  reproducibilityRate: any;
  constructor({
    certificationCourseId,
    certifiableBadgeKey,
    reproducibilityRate,
    hasAcquiredPixCertification
  }: any = {}) {
    super({
      certificationCourseId,
      partnerKey: null,
      temporaryPartnerKey: certifiableBadgeKey,
    });

    this.reproducibilityRate = reproducibilityRate;
    this.hasAcquiredPixCertification = hasAcquiredPixCertification;
  }

  isAcquired() {
    return this.hasAcquiredPixCertification && this.reproducibilityRate.isEqualOrAbove(70);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PixPlusEduCertificationScoring;
