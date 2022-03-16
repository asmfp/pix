// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('./Assessment');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'status'.
const status = {
  REJECTED: 'rejected',
  VALIDATED: 'validated',
  ERROR: 'error',
  CANCELLED: 'cancelled',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
class AssessmentResult {
  assessmentId: any;
  commentForCandidate: any;
  commentForJury: any;
  commentForOrganization: any;
  competenceMarks: any;
  createdAt: any;
  emitter: any;
  id: any;
  juryId: any;
  pixScore: any;
  status: any;
  // FIXME: assessmentId && juryId to replace by assessment && jury domain objects
  constructor({
    id,
    commentForCandidate,
    commentForJury,
    commentForOrganization,
    createdAt,
    emitter,
    pixScore,
    status,
    competenceMarks = [],
    assessmentId,
    juryId
  }: any = {}) {
    this.id = id;
    this.commentForCandidate = commentForCandidate;
    this.commentForJury = commentForJury;
    this.commentForOrganization = commentForOrganization;
    this.createdAt = createdAt;
    this.emitter = emitter;
    this.pixScore = pixScore;
    this.status = status;
    this.competenceMarks = competenceMarks;
    this.assessmentId = assessmentId;
    this.juryId = juryId;
  }

  static buildAlgoErrorResult({
    error,
    assessmentId,
    juryId,
    emitter
  }: any) {
    return new AssessmentResult({
      emitter,
      commentForJury: error.message,
      pixScore: 0,
      status: status.ERROR,
      assessmentId,
      juryId,
    });
  }

  static buildStandardAssessmentResult({
    pixScore,
    status,
    assessmentId,
    juryId,
    emitter
  }: any) {
    return new AssessmentResult({
      emitter,
      commentForJury: 'Computed',
      pixScore: pixScore,
      status,
      assessmentId,
      juryId,
    });
  }

  static buildStartedAssessmentResult({
    assessmentId
  }: any) {
    return new AssessmentResult({
      assessmentId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
      status: Assessment.states.STARTED,
    });
  }

  static buildNotTrustableAssessmentResult({
    pixScore,
    status,
    assessmentId,
    juryId,
    emitter
  }: any) {
    return new AssessmentResult({
      emitter,
      commentForCandidate:
        'Un ou plusieurs problème(s) technique(s), signalé(s) à votre surveillant pendant la session de certification' +
        ', a/ont affecté la qualité du test de certification. En raison du trop grand nombre de questions auxquelles vous ' +
        "n'avez pas pu répondre dans de bonnes conditions, nous ne sommes malheureusement pas en mesure de calculer un " +
        'score fiable et de fournir un certificat. La certification est annulée, le prescripteur de votre certification' +
        '(le cas échéant), en est informé.',
      commentForOrganization:
        'Un ou plusieurs problème(s) technique(s), signalés par ce(cette) candidate au surveillant' +
        'de la session de certification, a/ont affecté le bon déroulement du test de certification. Nous sommes dans ' +
        "l'incapacité de le/la certifier, sa certification est donc annulée. Cette information est à prendre en compte " +
        'et peut vous conduire à proposer une nouvelle session de certification pour ce(cette) candidat(e).',
      commentForJury: 'Computed',
      pixScore,
      status,
      assessmentId,
      juryId,
    });
  }

  isValidated() {
    return this.status === status.VALIDATED;
  }
}

AssessmentResult.status = status;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AssessmentResult;
