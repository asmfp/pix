// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { MINIMUM_COMPETENCE_LEVEL_FOR_CERTIFIABILITY } = require('../constants');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserCompet... Remove this comment to see the full error message
class UserCompetence {
  area: any;
  estimatedLevel: any;
  id: any;
  index: any;
  name: any;
  pixScore: any;
  skills: any;
  constructor({
    id,
    index,
    name,
    area,
    pixScore,
    estimatedLevel,
    skills = []
  }: any = {}) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.area = area;
    this.pixScore = pixScore;
    this.estimatedLevel = estimatedLevel;
    this.skills = skills;
  }

  addSkill(newSkill: any) {
    const hasAlreadySkill = _(this.skills)
      .filter((skill: any) => skill.name === newSkill.name)
      .size();

    if (!hasAlreadySkill) {
      this.skills.push(newSkill);
    }
  }

  isCertifiable() {
    return this.estimatedLevel >= MINIMUM_COMPETENCE_LEVEL_FOR_CERTIFIABILITY;
  }

  getSkillsAtLatestVersion() {
    const skillsSortedByNameAndVersion = _.orderBy(this.skills, ['name', 'version'], ['asc', 'desc']);
    return _.uniqWith(skillsSortedByNameAndVersion, (a: any, b: any) => a.name === b.name);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserCompetence;
