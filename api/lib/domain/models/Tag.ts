// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Tag'.
class Tag {
  id: any;
  name: any;
  constructor({
    id,
    name
  }: any = {}) {
    this.id = id;
    this.name = name;
  }
}
Tag.AGRICULTURE = 'AGRICULTURE';
Tag.POLE_EMPLOI = 'POLE EMPLOI';
Tag.MEDIATION_NUMERIQUE = 'MEDNUM';
Tag.CFA = 'CFA';
Tag.AEFE = 'AEFE';
Tag.MLF = 'MLF';
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Tag;
