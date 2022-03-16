// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isNil'.
const isNil = require('lodash/isNil');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidateForAttendanceSheet {
  birthdate: any;
  division: any;
  externalId: any;
  extraTimePercentage: any;
  firstName: any;
  lastName: any;
  constructor({
    lastName,
    firstName,
    birthdate,
    externalId,
    division,
    extraTimePercentage
  }: any) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.birthdate = birthdate;
    this.externalId = externalId;
    this.division = division;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseFloat'.
    this.extraTimePercentage = !isNil(extraTimePercentage) ? parseFloat(extraTimePercentage) : extraTimePercentage;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCandidateForAttendanceSheet;
