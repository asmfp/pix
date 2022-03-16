// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hashInt'.
const hashInt = require('hash-int');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
const { ObjectValidationError } = require('../errors');

const courseIdMessage = {
  COMPETENCE_EVALUATION: '[NOT USED] CompetenceId is in Competence Evaluation.',
  CAMPAIGN: '[NOT USED] Campaign Assessment CourseId Not Used',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'states'.
const states = {
  COMPLETED: 'completed',
  STARTED: 'started',
  ABORTED: 'aborted',
  ENDED_BY_SUPERVISOR: 'endedBySupervisor',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'types'.
const types = {
  CERTIFICATION: 'CERTIFICATION',
  COMPETENCE_EVALUATION: 'COMPETENCE_EVALUATION',
  DEMO: 'DEMO',
  PREVIEW: 'PREVIEW',
  CAMPAIGN: 'CAMPAIGN',
};

const TYPES_OF_ASSESSMENT_NEEDING_USER = [types.CERTIFICATION, types.COMPETENCE_EVALUATION, types.CAMPAIGN];

const methods = {
  SMART_RANDOM: 'SMART_RANDOM',
  CERTIFICATION_DETERMINED: 'CERTIFICATION_DETERMINED',
  COURSE_DETERMINED: 'COURSE_DETERMINED',
  CHOSEN: 'CHOSEN',
  FLASH: 'FLASH',
};

const statesOfLastQuestion = {
  ASKED: 'asked',
  TIMEOUT: 'timeout',
  FOCUSEDOUT: 'focusedout',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
class Assessment {
  answers: any;
  campaignParticipation: any;
  campaignParticipationId: any;
  certificationCourseId: any;
  competenceId: any;
  course: any;
  courseId: any;
  createdAt: any;
  id: any;
  isImproving: any;
  lastChallengeId: any;
  lastQuestionDate: any;
  lastQuestionState: any;
  method: any;
  state: any;
  targetProfile: any;
  title: any;
  type: any;
  updatedAt: any;
  userId: any;
  constructor({
    id,
    createdAt,
    updatedAt,
    state,
    title,
    type,
    isImproving,
    lastChallengeId,
    lastQuestionState,
    answers = [],
    campaignParticipation,
    course,
    targetProfile,
    lastQuestionDate,
    courseId,
    certificationCourseId,
    userId,
    competenceId,
    campaignParticipationId,
    method
  }: any = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.state = state;
    this.title = title;
    this.type = type;
    this.isImproving = isImproving;
    this.lastChallengeId = lastChallengeId;
    this.lastQuestionState = lastQuestionState;
    this.answers = answers;
    this.campaignParticipation = campaignParticipation;
    this.course = course;
    this.targetProfile = targetProfile;
    this.lastQuestionDate = lastQuestionDate;
    this.courseId = courseId;
    this.certificationCourseId = certificationCourseId;
    this.userId = userId;
    this.competenceId = competenceId;
    this.campaignParticipationId = campaignParticipationId;
    this.method = method || Assessment.computeMethodFromType(this.type);
  }

  isCompleted() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
    return this.state === Assessment.states.COMPLETED;
  }

  isStarted() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
    return this.state === Assessment.states.STARTED;
  }

  isEndedBySupervisor() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
    return this.state === Assessment.states.ENDED_BY_SUPERVISOR;
  }

  setCompleted() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
    this.state = Assessment.states.COMPLETED;
  }

  start() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
    this.state = Assessment.states.STARTED;
  }

  validate() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
    if (TYPES_OF_ASSESSMENT_NEEDING_USER.includes(this.type) && !this.userId) {
      // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
      return Promise.reject(new ObjectValidationError(`Assessment ${this.type} needs an User Id`));
    }
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
    return Promise.resolve();
  }

  isPreview() {
    return this.type === types.PREVIEW;
  }

  isDemo() {
    return this.type === types.DEMO;
  }

  isForCampaign() {
    return this.type === types.CAMPAIGN;
  }

  isCertification() {
    return this.type === types.CERTIFICATION;
  }

  isCompetenceEvaluation() {
    return this.type === types.COMPETENCE_EVALUATION;
  }

  hasKnowledgeElements() {
    return this.isCompetenceEvaluation() || (this.isForCampaign() && this.isSmartRandom());
  }

  isFlash() {
    return this.method === methods.FLASH;
  }

  isSmartRandom() {
    return this.method === methods.SMART_RANDOM;
  }

  chooseNextFlashChallenge(challenges: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    return challenges[Math.abs(hashInt(this.id)) % challenges.length];
  }

  static computeMethodFromType(type: any) {
    switch (type) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
      case Assessment.types.CERTIFICATION:
        return methods.CERTIFICATION_DETERMINED;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
      case Assessment.types.DEMO:
        return methods.COURSE_DETERMINED;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
      case Assessment.types.PREVIEW:
        return methods.CHOSEN;
      default:
        return methods.SMART_RANDOM;
    }
  }

  static createForCertificationCourse({
    userId,
    certificationCourseId
  }: any) {
    return new Assessment({
      userId,
      certificationCourseId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
      state: Assessment.states.STARTED,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
      type: Assessment.types.CERTIFICATION,
      isImproving: false,
      method: methods.CERTIFICATION_DETERMINED,
    });
  }

  static createForCampaign({
    userId,
    campaignParticipationId,
    method,
    isImproving = false
  }: any) {
    return new Assessment({
      userId,
      campaignParticipationId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
      state: Assessment.states.STARTED,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
      type: Assessment.types.CAMPAIGN,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'courseIdMessage' does not exist on type ... Remove this comment to see the full error message
      courseId: Assessment.courseIdMessage.CAMPAIGN,
      isImproving,
      method,
    });
  }

  static createImprovingForCampaign({
    userId,
    campaignParticipationId,
    method
  }: any) {
    const assessment = this.createForCampaign({ userId, campaignParticipationId, method });
    assessment.isImproving = true;
    return assessment;
  }

  static createForCompetenceEvaluation({
    userId,
    competenceId
  }: any) {
    return new Assessment({
      userId,
      competenceId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
      state: Assessment.states.STARTED,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
      type: Assessment.types.COMPETENCE_EVALUATION,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'courseIdMessage' does not exist on type ... Remove this comment to see the full error message
      courseId: Assessment.courseIdMessage.COMPETENCE_EVALUATION,
      isImproving: false,
      method: methods.SMART_RANDOM,
    });
  }

  static createImprovingForCompetenceEvaluation({
    userId,
    competenceId
  }: any) {
    const assessment = this.createForCompetenceEvaluation({ userId, competenceId });
    assessment.isImproving = true;
    return assessment;
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'courseIdMessage' does not exist on type ... Remove this comment to see the full error message
Assessment.courseIdMessage = courseIdMessage;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
Assessment.states = states;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
Assessment.types = types;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'statesOfLastQuestion' does not exist on ... Remove this comment to see the full error message
Assessment.statesOfLastQuestion = statesOfLastQuestion;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'methods' does not exist on type 'typeof ... Remove this comment to see the full error message
Assessment.methods = methods;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Assessment;
