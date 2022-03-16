// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class SessionFinalized {
  certificationCenterName: any;
  finalizedAt: any;
  hasExaminerGlobalComment: any;
  sessionDate: any;
  sessionId: any;
  sessionTime: any;
  constructor({
    sessionId,
    finalizedAt,
    hasExaminerGlobalComment,
    sessionDate,
    sessionTime,
    certificationCenterName
  }: any) {
    this.sessionId = sessionId;
    this.finalizedAt = finalizedAt;
    this.hasExaminerGlobalComment = hasExaminerGlobalComment;
    this.sessionDate = sessionDate;
    this.sessionTime = sessionTime;
    this.certificationCenterName = certificationCenterName;
  }
};
