// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetedSk... Remove this comment to see the full error message
class TargetedSkill {
  id: any;
  name: any;
  tubeId: any;
  tutorialIds: any;
  constructor({
    id,
    name,
    tubeId,
    tutorialIds
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.tubeId = tubeId;
    this.tutorialIds = tutorialIds;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get difficulty() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    return parseInt(this.name.slice(-1));
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetedSkill;
