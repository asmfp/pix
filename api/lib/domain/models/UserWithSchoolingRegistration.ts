// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserWithSc... Remove this comment to see the full error message
class UserWithSchoolingRegistration {
  birthdate: any;
  division: any;
  email: any;
  firstName: any;
  group: any;
  id: any;
  isAuthenticatedFromGAR: any;
  lastName: any;
  organizationId: any;
  studentNumber: any;
  userId: any;
  username: any;
  constructor({
    id,
    lastName,
    firstName,
    birthdate,
    userId,
    organizationId,
    username,
    email,
    isAuthenticatedFromGAR,
    studentNumber,
    division,
    group
  }: any = {}) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.birthdate = birthdate;
    this.userId = userId;
    this.organizationId = organizationId;
    this.username = username;
    this.email = email;
    this.isAuthenticatedFromGAR = isAuthenticatedFromGAR;
    this.studentNumber = studentNumber;
    this.division = division;
    this.group = group;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserWithSchoolingRegistration;
