// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
class AssessmentCompleted {
  assessmentId: any;
  campaignParticipationId: any;
  certificationCourseId: any;
  userId: any;
  constructor({
    assessmentId,
    userId,
    campaignParticipationId,
    certificationCourseId
  }: any = {}) {
    this.assessmentId = assessmentId;
    this.userId = userId;
    this.campaignParticipationId = campaignParticipationId;
    this.certificationCourseId = certificationCourseId;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isCertificationType() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.certificationCourseId);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isCampaignType() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.campaignParticipationId);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AssessmentCompleted;
