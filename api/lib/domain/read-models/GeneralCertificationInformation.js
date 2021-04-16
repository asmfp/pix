class GeneralCertificationInformation {
  constructor({
    certificationCourseId,

    sessionId,
    createdAt,
    completedAt,
    isPublished,
    isV2Certification,

    firstName,
    lastName,
    birthdate,
    birthplace,

    certificationIssueReports,
  }) {
    this.certificationCourseId = certificationCourseId;

    this.sessionId = sessionId;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.isPublished = isPublished;
    this.isV2Certification = isV2Certification;

    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthplace = birthplace;
    this.certificationIssueReports = certificationIssueReports;
  }
}

module.exports = GeneralCertificationInformation;