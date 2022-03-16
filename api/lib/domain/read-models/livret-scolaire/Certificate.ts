// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { VALIDATED, PENDING } = require('./CertificateStatus');

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'Certificate'.
class Certificate {
  birthdate: any;
  certificationCenter: any;
  competenceResults: any;
  date: any;
  deliveredAt: any;
  firstName: any;
  id: any;
  lastName: any;
  middleName: any;
  nationalStudentId: any;
  pixScore: any;
  status: any;
  thirdName: any;
  verificationCode: any;
  constructor({
    id,
    firstName,
    middleName,
    thirdName,
    lastName,
    birthdate,
    nationalStudentId,
    status,
    pixScore,
    verificationCode,
    date,
    deliveredAt,
    certificationCenter,
    competenceResults = []
  }: any = {}) {
    this.id = id;
    this.firstName = firstName;
    this.middleName = middleName;
    this.thirdName = thirdName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.nationalStudentId = nationalStudentId;
    this.date = date;
    this.deliveredAt = deliveredAt;
    this.pixScore = pixScore;
    this.status = status;
    this.competenceResults = competenceResults;
    this.certificationCenter = certificationCenter;
    this.verificationCode = verificationCode;
  }

  static from({
    id,
    firstName,
    middleName,
    thirdName,
    lastName,
    birthdate,
    nationalStudentId,
    isPublished,
    status,
    pixScore,
    verificationCode,
    date,
    deliveredAt,
    certificationCenter,
    competenceResults
  }: any = {}) {
    const isValidated = _isValidated(status);
    const displayScore = _displayScore({ isPublished, isValidated });
    const updatedStatus = isPublished ? status : PENDING;
    const updatedScore = displayScore ? pixScore : 0;
    const updatedCompetenceResults = displayScore ? competenceResults : [];

    return new Certificate({
      id,
      firstName,
      middleName,
      thirdName,
      lastName,
      birthdate,
      nationalStudentId,
      isPublished,
      status: updatedStatus,
      pixScore: updatedScore,
      verificationCode,
      date,
      deliveredAt,
      certificationCenter,
      competenceResults: updatedCompetenceResults,
    });
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Certificate;

function _isValidated(status: any) {
  return status === VALIDATED;
}

function _displayScore({
  isPublished,
  isValidated
}: any) {
  return isPublished && isValidated;
}
