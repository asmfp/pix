// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class AutoJuryDone {
  certificationCenterName: any;
  finalizedAt: any;
  hasExaminerGlobalComment: any;
  sessionDate: any;
  sessionId: any;
  sessionTime: any;
  constructor({
    sessionId,
    finalizedAt,
    certificationCenterName,
    sessionDate,
    sessionTime,
    hasExaminerGlobalComment
  }: any) {
    this.sessionId = sessionId;
    this.finalizedAt = finalizedAt;
    this.certificationCenterName = certificationCenterName;
    this.sessionDate = sessionDate;
    this.sessionTime = sessionTime;
    this.hasExaminerGlobalComment = hasExaminerGlobalComment;
  }
};
