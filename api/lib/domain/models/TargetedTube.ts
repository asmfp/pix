// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetedTu... Remove this comment to see the full error message
class TargetedTube {
  competenceId: any;
  description: any;
  id: any;
  practicalTitle: any;
  skills: any;
  constructor({
    id,
    practicalTitle,
    description,
    competenceId,
    skills = []
  }: any = {}) {
    this.id = id;
    this.practicalTitle = practicalTitle;
    this.description = description;
    this.competenceId = competenceId;
    this.skills = skills;
  }

  hasSkill(skillId: any) {
    return this.skills.some((skill: any) => skill.id === skillId);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetedTube;
