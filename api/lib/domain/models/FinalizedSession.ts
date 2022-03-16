// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'some'.
const some = require('lodash/some');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'every'.
const every = require('lodash/every');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class FinalizedSession {
  assignedCertificationOfficerName: any;
  certificationCenterName: any;
  finalizedAt: any;
  isPublishable: any;
  publishedAt: any;
  sessionDate: any;
  sessionId: any;
  sessionTime: any;
  constructor({
    sessionId,
    finalizedAt,
    certificationCenterName,
    sessionDate,
    sessionTime,
    isPublishable,
    publishedAt,
    assignedCertificationOfficerName
  }: any = {}) {
    this.sessionId = sessionId;
    this.finalizedAt = finalizedAt;
    this.certificationCenterName = certificationCenterName;
    this.sessionDate = sessionDate;
    this.sessionTime = sessionTime;
    this.isPublishable = isPublishable;
    this.publishedAt = publishedAt;
    this.assignedCertificationOfficerName = assignedCertificationOfficerName;
  }

  static from({
    sessionId,
    finalizedAt,
    certificationCenterName,
    sessionDate,
    sessionTime,
    hasExaminerGlobalComment,
    juryCertificationSummaries,
    hasSupervisorAccess
  }: any) {
    return new FinalizedSession({
      sessionId,
      finalizedAt,
      certificationCenterName,
      sessionDate,
      sessionTime,
      isPublishable:
        !hasExaminerGlobalComment &&
        _hasNoIssueReportsWithRequiredAction(juryCertificationSummaries) &&
        _isNotFlaggedAsAborted(juryCertificationSummaries) &&
        _hasNoScoringErrorOrUncompletedAssessmentResults(juryCertificationSummaries) &&
        (hasSupervisorAccess || _hasExaminerSeenAllEndScreens(juryCertificationSummaries)),
      publishedAt: null,
    });
  }

  publish(now: any) {
    this.publishedAt = now;
  }

  unpublish() {
    this.publishedAt = null;
  }

  assignCertificationOfficer({
    certificationOfficerName
  }: any) {
    this.isPublishable = false;
    this.assignedCertificationOfficerName = certificationOfficerName;
  }
};

function _hasNoIssueReportsWithRequiredAction(juryCertificationSummaries: any) {
  return !juryCertificationSummaries.some((summary: any) => summary.isActionRequired());
}

function _isNotFlaggedAsAborted(juryCertificationSummaries: any) {
  return !juryCertificationSummaries.some((summary: any) => summary.isFlaggedAborted);
}

function _hasNoScoringErrorOrUncompletedAssessmentResults(juryCertificationSummaries: any) {
  return !some(juryCertificationSummaries, (summary: any) => {
    return summary.hasScoringError() || !summary.hasCompletedAssessment();
  });
}

function _hasExaminerSeenAllEndScreens(juryCertificationSummaries: any) {
  return every(juryCertificationSummaries.map((summary: any) => summary.hasSeenEndTestScreen));
}
