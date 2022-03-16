// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCpfCity {
  INSEECode: any;
  id: any;
  isActualName: any;
  name: any;
  postalCode: any;
  constructor({
    id,
    name,
    postalCode,
    INSEECode,
    isActualName
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.postalCode = postalCode;
    this.INSEECode = INSEECode;
    this.isActualName = isActualName;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCpfCity;
