// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ResultComp... Remove this comment to see the full error message
class ResultCompetence {
  id: any;
  index: any;
  level: any;
  name: any;
  score: any;
  constructor({
    id,
    index,
    level,
    name,
    score
  }: any = {}) {
    this.id = id;
    this.index = index;
    this.level = level;
    this.name = name;
    this.score = score;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ResultCompetence;
