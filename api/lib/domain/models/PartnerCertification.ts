// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PartnerCer... Remove this comment to see the full error message
class PartnerCertification {
  acquired: any;
  certificationCourseId: any;
  partnerKey: any;
  constructor({
    certificationCourseId,
    partnerKey,
    acquired
  }: any = {}) {
    this.certificationCourseId = certificationCourseId;
    this.partnerKey = partnerKey;
    this.acquired = acquired;
  }

  static from({
    certificationCourseId,
    partnerKey,
    acquired
  }: any) {
    return new PartnerCertification({ certificationCourseId, partnerKey, acquired });
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PartnerCertification;
