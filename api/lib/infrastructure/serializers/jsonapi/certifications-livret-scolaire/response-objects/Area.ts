// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'Area'.
class Area {
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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Area;
