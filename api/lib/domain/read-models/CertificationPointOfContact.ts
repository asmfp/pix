// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationPointOfContact {
  allowedCertificationCenterAccesses: any;
  email: any;
  firstName: any;
  id: any;
  lastName: any;
  pixCertifTermsOfServiceAccepted: any;
  constructor({
    id,
    firstName,
    lastName,
    email,
    pixCertifTermsOfServiceAccepted,
    allowedCertificationCenterAccesses
  }: any) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.pixCertifTermsOfServiceAccepted = pixCertifTermsOfServiceAccepted;
    this.allowedCertificationCenterAccesses = allowedCertificationCenterAccesses;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationPointOfContact;
