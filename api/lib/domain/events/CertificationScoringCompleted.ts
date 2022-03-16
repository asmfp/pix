// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationScoringCompleted {
  certificationCourseId: any;
  reproducibilityRate: any;
  userId: any;
  constructor({
    certificationCourseId,
    userId,
    reproducibilityRate
  }: any) {
    this.certificationCourseId = certificationCourseId;
    this.userId = userId;
    this.reproducibilityRate = reproducibilityRate;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationScoringCompleted;
