// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Tube'.
class Tube {
  competenceId: any;
  description: any;
  id: any;
  name: any;
  practicalDescription: any;
  practicalTitle: any;
  skills: any;
  title: any;
  constructor({
    id,
    name,
    title,
    description,
    practicalTitle,
    practicalDescription,
    skills = [],
    competenceId
  }: any = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.practicalTitle = practicalTitle;
    this.practicalDescription = practicalDescription;
    this.skills = skills;
    this.competenceId = competenceId;

    if (name) {
      this.name = name;
    } else if (skills.length > 0) {
      this.name = skills[0].tubeNameWithoutPrefix;
    } else {
      this.name = '';
    }
  }

  addSkill(skillToAdd: any) {
    if (!this.skills.find((skill: any) => skill.name === skillToAdd.name)) {
      this.skills.push(skillToAdd);
    }
  }

  getEasierThan(skill: any) {
    return this.skills.filter((tubeSkill: any) => tubeSkill.difficulty <= skill.difficulty);
  }

  getHarderThan(skill: any) {
    return this.skills.filter((tubeSkill: any) => tubeSkill.difficulty >= skill.difficulty);
  }

  getHardestSkill() {
    return _.maxBy(this.skills, 'difficulty');
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Tube;
