// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('./Assessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceEvaluation = require('./CompetenceEvaluation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('./KnowledgeElement');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../constants');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'scoringSer... Remove this comment to see the full error message
const scoringService = require('../services/scoring/scoring-service');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  NOT_STARTED: 'NOT_STARTED',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
class Scorecard {
  area: any;
  competenceId: any;
  description: any;
  earnedPix: any;
  exactlyEarnedPix: any;
  id: any;
  index: any;
  level: any;
  name: any;
  pixScoreAheadOfNextLevel: any;
  remainingDaysBeforeImproving: any;
  remainingDaysBeforeReset: any;
  status: any;
  tutorials: any;
  constructor({
    id,
    name,
    description,
    competenceId,
    index,
    level,
    area,
    pixScoreAheadOfNextLevel,
    earnedPix,
    exactlyEarnedPix,
    status,
    remainingDaysBeforeReset,
    remainingDaysBeforeImproving,
    tutorials
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.competenceId = competenceId;
    this.index = index;
    this.area = area;
    this.earnedPix = earnedPix;
    this.exactlyEarnedPix = exactlyEarnedPix;
    this.level = level;
    this.pixScoreAheadOfNextLevel = pixScoreAheadOfNextLevel;
    this.status = status;
    this.remainingDaysBeforeReset = remainingDaysBeforeReset;
    this.remainingDaysBeforeImproving = remainingDaysBeforeImproving;
    this.tutorials = tutorials;
  }

  static parseId(scorecardId: any) {
    const [userId, competenceId] = scorecardId.split('_');
    return { userId: _.parseInt(userId), competenceId };
  }

  static buildFrom({
    userId,
    knowledgeElements,
    competence,
    competenceEvaluation,
    allowExcessPix = false,
    allowExcessLevel = false
  }: any) {
    const { realTotalPixScoreForCompetence, pixScoreForCompetence, currentLevel, pixAheadForNextLevel } =
      scoringService.calculateScoringInformationForCompetence({ knowledgeElements, allowExcessPix, allowExcessLevel });
    const remainingDaysBeforeReset = _.isEmpty(knowledgeElements)
      ? null
      : Scorecard.computeRemainingDaysBeforeReset(knowledgeElements);
    const remainingDaysBeforeImproving = _.isEmpty(knowledgeElements)
      ? null
      : Scorecard.computeRemainingDaysBeforeImproving(knowledgeElements);

    return new Scorecard({
      id: `${userId}_${competence.id}`,
      name: competence.name,
      description: competence.description,
      competenceId: competence.id,
      index: competence.index,
      area: competence.area,
      earnedPix: pixScoreForCompetence,
      exactlyEarnedPix: realTotalPixScoreForCompetence,
      level: currentLevel,
      pixScoreAheadOfNextLevel: pixAheadForNextLevel,
      status: _getScorecardStatus(competenceEvaluation, knowledgeElements),
      remainingDaysBeforeReset,
      remainingDaysBeforeImproving,
    });
  }

  static computeRemainingDaysBeforeReset(knowledgeElements: any) {
    const daysSinceLastKnowledgeElement = KnowledgeElement.computeDaysSinceLastKnowledgeElement(knowledgeElements);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    const remainingDaysToWait = Math.ceil(constants.MINIMUM_DELAY_IN_DAYS_FOR_RESET - daysSinceLastKnowledgeElement);

    return remainingDaysToWait > 0 ? remainingDaysToWait : 0;
  }

  static computeRemainingDaysBeforeImproving(knowledgeElements: any) {
    const daysSinceLastKnowledgeElement = KnowledgeElement.computeDaysSinceLastKnowledgeElement(knowledgeElements);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    const remainingDaysToWait = Math.ceil(
      constants.MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING - daysSinceLastKnowledgeElement
    );

    return remainingDaysToWait > 0 ? remainingDaysToWait : 0;
  }
}

function _getScorecardStatus(competenceEvaluation: any, knowledgeElements: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'statuses' does not exist on type 'typeof... Remove this comment to see the full error message
  if (!competenceEvaluation || competenceEvaluation.status === CompetenceEvaluation.statuses.RESET) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'NOT_STARTED' does not exist on type '{ D... Remove this comment to see the full error message
    return _.isEmpty(knowledgeElements) ? statuses.NOT_STARTED : statuses.STARTED;
  }
  const stateOfAssessment = _.get(competenceEvaluation, 'assessment.state');
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
  if (stateOfAssessment === Assessment.states.COMPLETED) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'COMPLETED' does not exist on type '{ DOW... Remove this comment to see the full error message
    return statuses.COMPLETED;
  }
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'STARTED' does not exist on type '{ DOWNG... Remove this comment to see the full error message
  return statuses.STARTED;
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'statuses' does not exist on type 'typeof... Remove this comment to see the full error message
Scorecard.statuses = statuses;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Scorecard;
