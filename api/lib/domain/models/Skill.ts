// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Skill'.
class Skill {
  competenceId: any;
  id: any;
  name: any;
  pixValue: any;
  tubeId: any;
  tutorialIds: any;
  version: any;
  constructor({
    id,
    name,
    pixValue,
    competenceId,
    tutorialIds = [],
    tubeId,
    version
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.pixValue = pixValue;
    this.competenceId = competenceId;
    this.tutorialIds = tutorialIds;
    this.tubeId = tubeId;
    this.version = version;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get difficulty() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    return parseInt(this.name.slice(-1));
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get tubeName() {
    return this.name.slice(0, -1); //with skill'@sourceImage2', returns '@sourceImage'
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get tubeNameWithoutPrefix() {
    return this.tubeName.slice(1); //with skill '@sourceImage2', returns 'sourceImage'
  }

  static areEqual(oneSkill: any, otherSkill: any) {
    if (oneSkill == null || otherSkill == null) {
      return false;
    }

    return oneSkill.name === otherSkill.name;
  }

  static areEqualById(oneSkill: any, otherSkill: any) {
    if (oneSkill == null || otherSkill == null) {
      return false;
    }

    return oneSkill.id === otherSkill.id;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Skill;
