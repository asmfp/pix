// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'Competence'.
class Competence {
  area: any;
  id: any;
  name: any;
  constructor({
    id,
    name,
    area
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.area = area;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Competence;
