// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ShareableC... Remove this comment to see the full error message
class ShareableCertificate {
  birthdate: any;
  birthplace: any;
  certificationCenter: any;
  certifiedBadgeImages: any;
  cleaCertificationResult: any;
  date: any;
  deliveredAt: any;
  firstName: any;
  id: any;
  isPublished: any;
  lastName: any;
  maxReachableLevelOnCertificationDate: any;
  pixScore: any;
  resultCompetenceTree: any;
  userId: any;
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
    cleaCertificationResult,
    certifiedBadgeImages,
    resultCompetenceTree = null,
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
    this.cleaCertificationResult = cleaCertificationResult;
    this.certifiedBadgeImages = certifiedBadgeImages;
    this.resultCompetenceTree = resultCompetenceTree;
    this.maxReachableLevelOnCertificationDate = maxReachableLevelOnCertificationDate;
  }

  setResultCompetenceTree(resultCompetenceTree: any) {
    this.resultCompetenceTree = resultCompetenceTree;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ShareableCertificate;
