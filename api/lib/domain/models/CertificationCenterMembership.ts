// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCenterMembership {
  certificationCenter: any;
  createdAt: any;
  disabledAt: any;
  id: any;
  user: any;
  constructor({
    id,
    certificationCenter,
    user,
    createdAt,
    disabledAt
  }: any = {}) {
    this.id = id;
    this.certificationCenter = certificationCenter;
    this.user = user;
    this.createdAt = createdAt;
    this.disabledAt = disabledAt;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCenterMembership;
