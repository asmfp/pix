// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'CompetenceResults'.
class CompetenceResults {
  competenceId: any;
  level: any;
  constructor({
    level,
    competenceId
  }: any = {}) {
    (this.level = level), (this.competenceId = competenceId);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CompetenceResults;
