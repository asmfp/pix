// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'StudentFor... Remove this comment to see the full error message
class StudentForEnrollment {
  birthdate: any;
  division: any;
  firstName: any;
  id: any;
  isEnrolled: any;
  lastName: any;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    division,
    isEnrolled
  }: any = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.division = division;
    this.isEnrolled = isEnrolled;
  }

  static fromStudentsAndCertificationCandidates({
    student,
    certificationCandidates
  }: any) {
    const isEnrolled = certificationCandidates.some((candidate: any) => candidate.schoolingRegistrationId === student.id);

    return new StudentForEnrollment({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      birthdate: student.birthdate,
      division: student.division,
      isEnrolled,
    });
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = StudentForEnrollment;
