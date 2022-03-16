// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
class CompetenceTree {
  areas: any;
  id: any;
  constructor({ id = 1, areas = [] } = {}) {
    this.id = id;
    this.areas = areas;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CompetenceTree;
