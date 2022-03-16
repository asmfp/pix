// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
const { PIX_PLUS_DROIT, CLEA } = require('./ComplementaryCertification');

const SUP = 'SUP';
const SCO = 'SCO';
const PRO = 'PRO';

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'types'.
const types = {
  SUP,
  SCO,
  PRO,
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCenter {
  createdAt: any;
  externalId: any;
  habilitations: any;
  id: any;
  isSupervisorAccessEnabled: any;
  name: any;
  type: any;
  updatedAt: any;
  constructor({
    id,
    name,
    externalId,
    type,
    createdAt,
    updatedAt,
    habilitations = [],
    isSupervisorAccessEnabled = false
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.externalId = externalId;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.habilitations = habilitations;
    this.isSupervisorAccessEnabled = isSupervisorAccessEnabled;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isSco() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'SCO' does not exist on type '{ CERTIFICA... Remove this comment to see the full error message
    return this.type === types.SCO;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isHabilitatedPixPlusDroit() {
    return this.habilitations.some((habilitation: any) => habilitation.name === PIX_PLUS_DROIT);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isHabilitatedClea() {
    return this.habilitations.some((habilitation: any) => habilitation.name === CLEA);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCenter;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.types = types;
