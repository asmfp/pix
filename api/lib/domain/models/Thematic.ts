// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Thematic'.
class Thematic {
  id: any;
  index: any;
  name: any;
  tubeIds: any;
  constructor({
    id,
    name,
    index,
    tubeIds = []
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.index = index;
    this.tubeIds = tubeIds;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Thematic;
