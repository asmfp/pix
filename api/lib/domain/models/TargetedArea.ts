// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetedAr... Remove this comment to see the full error message
class TargetedArea {
  color: any;
  competences: any;
  id: any;
  title: any;
  constructor({
    id,
    title,
    color,
    competences = []
  }: any = {}) {
    this.id = id;
    this.title = title;
    this.color = color;
    this.competences = competences;
  }

  hasCompetence(competenceId: any) {
    return this.competences.some((competence: any) => competence.id === competenceId);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetedArea;
