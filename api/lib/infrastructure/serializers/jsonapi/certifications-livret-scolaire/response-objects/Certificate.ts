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
    this.certificationCenter = certificationCenter;
    this.competenceResults = competenceResults;
    this.verificationCode = verificationCode;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Certificate;
