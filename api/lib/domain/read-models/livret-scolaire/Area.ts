// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'Area'.
class Area {
  code: any;
  id: any;
  name: any;
  title: any;
  constructor({
    id,
    code,
    name,
    title
  }: any = {}) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.title = title;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Area;
