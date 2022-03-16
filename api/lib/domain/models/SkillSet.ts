// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SkillSet'.
class SkillSet {
  badgeId: any;
  id: any;
  name: any;
  skillIds: any;
  constructor({
    id,
    name,
    skillIds,
    badgeId
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.skillIds = skillIds;
    this.badgeId = badgeId;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SkillSet;
