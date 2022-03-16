class GeneralCertificationInformation {
  birthCountry: any;
  birthINSEECode: any;
  birthPostalCode: any;
  birthdate: any;
  birthplace: any;
  certificationCourseId: any;
  certificationIssueReports: any;
  completedAt: any;
  createdAt: any;
  firstName: any;
  isCancelled: any;
  isPublished: any;
  lastName: any;
  sessionId: any;
  sex: any;
  userId: any;
  constructor({
    certificationCourseId,
    sessionId,
    createdAt,
    completedAt,
    isPublished,
    isCancelled,
    firstName,
    lastName,
    birthdate,
    birthplace,
    birthCountry,
    birthPostalCode,
    birthINSEECode,
    sex,
    userId,
    certificationIssueReports
  }: any) {
    this.certificationCourseId = certificationCourseId;

    this.sessionId = sessionId;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.isPublished = isPublished;
    this.isCancelled = isCancelled;

    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthplace = birthplace;
    this.birthPostalCode = birthPostalCode;
    this.birthINSEECode = birthINSEECode;
    this.birthCountry = birthCountry;
    this.sex = sex;
    this.userId = userId;

    this.certificationIssueReports = certificationIssueReports;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = GeneralCertificationInformation;
