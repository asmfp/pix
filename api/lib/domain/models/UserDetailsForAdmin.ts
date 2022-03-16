// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserDetail... Remove this comment to see the full error message
class UserDetailsForAdmin {
  authenticationMethods: any;
  cgu: any;
  email: any;
  firstName: any;
  id: any;
  lastName: any;
  pixCertifTermsOfServiceAccepted: any;
  pixOrgaTermsOfServiceAccepted: any;
  schoolingRegistrations: any;
  username: any;
  constructor({
    id,
    cgu,
    username,
    firstName,
    lastName,
    email,
    pixOrgaTermsOfServiceAccepted,
    pixCertifTermsOfServiceAccepted,
    schoolingRegistrations,
    authenticationMethods
  }: any = {}) {
    this.id = id;
    this.cgu = cgu;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.pixOrgaTermsOfServiceAccepted = pixOrgaTermsOfServiceAccepted;
    this.pixCertifTermsOfServiceAccepted = pixCertifTermsOfServiceAccepted;
    this.schoolingRegistrations = schoolingRegistrations;
    this.authenticationMethods = authenticationMethods;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserDetailsForAdmin;
