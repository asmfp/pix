// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
const PIX_PLUS_DROIT = 'Pix+ Droit';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CLEA'.
const CLEA = 'CléA Numérique';

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
class ComplementaryCertification {
  id: any;
  name: any;
  constructor({
    id,
    name
  }: any) {
    this.id = id;
    this.name = name;
  }

  isClea() {
    return this.name === CLEA;
  }

  isPixPlusDroit() {
    return this.name === PIX_PLUS_DROIT;
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'PIX_PLUS_DROIT' does not exist on type '... Remove this comment to see the full error message
ComplementaryCertification.PIX_PLUS_DROIT = PIX_PLUS_DROIT;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'CLEA' does not exist on type 'typeof Com... Remove this comment to see the full error message
ComplementaryCertification.CLEA = CLEA;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ComplementaryCertification;
