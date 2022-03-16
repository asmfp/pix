// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'StudentInf... Remove this comment to see the full error message
class StudentInformationForAccountRecovery {
  email: any;
  firstName: any;
  lastName: any;
  latestOrganizationName: any;
  username: any;
  constructor({
    firstName,
    lastName,
    username,
    email,
    latestOrganizationName
  }: any = {}) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.latestOrganizationName = latestOrganizationName;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = StudentInformationForAccountRecovery;
