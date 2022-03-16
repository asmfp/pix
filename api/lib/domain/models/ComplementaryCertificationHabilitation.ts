// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
class ComplementaryCertificationHabilitation {
  certificationCenterId: any;
  complementaryCertificationId: any;
  id: any;
  constructor({
    id,
    complementaryCertificationId,
    certificationCenterId
  }: any) {
    this.id = id;
    this.complementaryCertificationId = complementaryCertificationId;
    this.certificationCenterId = certificationCenterId;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ComplementaryCertificationHabilitation;
