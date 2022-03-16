// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  STARTED: 'started',
  RESET: 'reset',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
class CompetenceEvaluation {
  assessment: any;
  assessmentId: any;
  competenceId: any;
  createdAt: any;
  id: any;
  scorecard: any;
  status: any;
  updatedAt: any;
  userId: any;
  constructor({
    id,
    createdAt,
    updatedAt,
    status,
    assessment,
    scorecard,
    assessmentId,
    competenceId,
    userId
  }: any = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    //includes
    this.assessment = assessment;
    this.scorecard = scorecard;
    this.assessmentId = assessmentId;
    this.competenceId = competenceId;
    this.userId = userId;
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'statuses' does not exist on type 'typeof... Remove this comment to see the full error message
CompetenceEvaluation.statuses = statuses;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CompetenceEvaluation;
