// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isNil'.
const isNil = require('lodash/isNil');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidateForSupervising {
  assessmentStatus: any;
  authorizedToStart: any;
  birthdate: any;
  extraTimePercentage: any;
  firstName: any;
  id: any;
  lastName: any;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    extraTimePercentage,
    authorizedToStart,
    assessmentStatus
  }: any = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseFloat'.
    this.extraTimePercentage = !isNil(extraTimePercentage) ? parseFloat(extraTimePercentage) : extraTimePercentage;
    this.authorizedToStart = authorizedToStart;
    this.assessmentStatus = assessmentStatus;
  }

  authorizeToStart() {
    this.authorizedToStart = true;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCandidateForSupervising;
