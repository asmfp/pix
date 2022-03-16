// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const { status: assessmentResultStatuses } = require('./AssessmentResult');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'status'.
const status = {
  REJECTED: 'rejected',
  VALIDATED: 'validated',
  ERROR: 'error',
  CANCELLED: 'cancelled',
  STARTED: 'started',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PrivateCer... Remove this comment to see the full error message
class PrivateCertificate {
  birthdate: any;
  birthplace: any;
  certificationCenter: any;
  certifiedBadgeImages: any;
  cleaCertificationResult: any;
  commentForCandidate: any;
  date: any;
  deliveredAt: any;
  firstName: any;
  id: any;
  isPublished: any;
  lastName: any;
  maxReachableLevelOnCertificationDate: any;
  pixScore: any;
  resultCompetenceTree: any;
  status: any;
  userId: any;
  verificationCode: any;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    date,
    deliveredAt,
    certificationCenter,
    pixScore,
    status,
    commentForCandidate,
    cleaCertificationResult,
    certifiedBadgeImages,
    resultCompetenceTree = null,
    verificationCode,
    maxReachableLevelOnCertificationDate
  }: any = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthplace = birthplace;
    this.isPublished = isPublished;
    this.userId = userId;
    this.date = date;
    this.deliveredAt = deliveredAt;
    this.certificationCenter = certificationCenter;
    this.pixScore = pixScore;
    this.status = status;
    this.commentForCandidate = commentForCandidate;
    this.cleaCertificationResult = cleaCertificationResult;
    this.certifiedBadgeImages = certifiedBadgeImages;
    this.resultCompetenceTree = resultCompetenceTree;
    this.verificationCode = verificationCode;
    this.maxReachableLevelOnCertificationDate = maxReachableLevelOnCertificationDate;
  }

  static buildFrom({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    date,
    deliveredAt,
    certificationCenter,
    pixScore,
    commentForCandidate,
    cleaCertificationResult,
    certifiedBadgeImages,
    resultCompetenceTree = null,
    verificationCode,
    maxReachableLevelOnCertificationDate,
    assessmentResultStatus,
    isCancelled
  }: any) {
    const status = _computeStatus(assessmentResultStatus, isCancelled);
    return new PrivateCertificate({
      id,
      firstName,
      lastName,
      birthdate,
      birthplace,
      isPublished,
      userId,
      date,
      deliveredAt,
      certificationCenter,
      pixScore,
      commentForCandidate,
      cleaCertificationResult,
      certifiedBadgeImages,
      resultCompetenceTree,
      verificationCode,
      maxReachableLevelOnCertificationDate,
      status,
    });
  }

  setResultCompetenceTree(resultCompetenceTree: any) {
    this.resultCompetenceTree = resultCompetenceTree;
  }
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _computeStatus(assessmentResultStatus: any, isCancelled: any) {
  if (isCancelled) return status.CANCELLED;
  if (assessmentResultStatus === assessmentResultStatuses.VALIDATED) return status.VALIDATED;
  if (assessmentResultStatus === assessmentResultStatuses.REJECTED) return status.REJECTED;
  if (assessmentResultStatus === assessmentResultStatuses.ERROR) return status.ERROR;
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'STARTED' does not exist on type '{ REJEC... Remove this comment to see the full error message
  return status.STARTED;
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'status' does not exist on type 'typeof P... Remove this comment to see the full error message
PrivateCertificate.status = status;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PrivateCertificate;
