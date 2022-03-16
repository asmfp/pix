// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetedCo... Remove this comment to see the full error message
class TargetedCompetence {
  areaId: any;
  id: any;
  index: any;
  name: any;
  origin: any;
  tubes: any;
  constructor({
    id,
    name,
    index,
    origin,
    areaId,
    tubes = []
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.index = index;
    this.origin = origin;
    this.areaId = areaId;
    this.tubes = tubes;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get skillCount() {
    return _.sumBy(this.tubes, (tube: any) => tube.skills.length);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetedCompetence;
