// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkValid... Remove this comment to see the full error message
const { checkValidation } = require('../validators/higher-schooling-registration-validator');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'HigherScho... Remove this comment to see the full error message
class HigherSchoolingRegistration {
  birthdate: any;
  department: any;
  diploma: any;
  educationalTeam: any;
  email: any;
  firstName: any;
  group: any;
  lastName: any;
  middleName: any;
  organizationId: any;
  preferredLastName: any;
  studentNumber: any;
  studyScheme: any;
  thirdName: any;
  constructor({
    firstName,
    middleName,
    thirdName,
    lastName,
    preferredLastName,
    studentNumber,
    email,
    birthdate,
    diploma,
    department,
    educationalTeam,
    group,
    studyScheme,
    organizationId
  }: any = {}) {
    this.firstName = firstName;
    this.middleName = middleName;
    this.thirdName = thirdName;
    this.lastName = lastName;
    this.preferredLastName = preferredLastName;
    this.studentNumber = studentNumber;
    this.email = email;
    this.birthdate = birthdate;
    this.diploma = diploma;
    this.department = department;
    this.educationalTeam = educationalTeam;
    this.group = group;
    this.studyScheme = studyScheme;
    this.organizationId = organizationId;
    checkValidation(this);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = HigherSchoolingRegistration;
