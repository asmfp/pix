// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'Competence'.
class Competence {
  area: any;
  description: any;
  id: any;
  index: any;
  level: any;
  name: any;
  origin: any;
  skillIds: any;
  thematicIds: any;
  constructor({
    id,
    area,
    name,
    index,
    description,
    origin,
    skillIds = [],
    thematicIds = []
  }: any = {}) {
    this.id = id;
    this.area = area;
    this.name = name;
    this.index = index;
    this.description = description;
    this.origin = origin;
    this.level = -1;
    this.skillIds = skillIds;
    this.thematicIds = thematicIds;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get reference() {
    return `${this.index} ${this.name}`;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Competence;
