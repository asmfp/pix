// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_COUNT_... Remove this comment to see the full error message
const { PIX_COUNT_BY_LEVEL, MAX_REACHABLE_LEVEL, MAX_REACHABLE_PIX_BY_COMPETENCE } = require('../../constants');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

function calculateScoringInformationForCompetence({
  knowledgeElements,
  allowExcessPix = false,
  allowExcessLevel = false
}: any) {
  const realTotalPixScoreForCompetence = _(knowledgeElements).sumBy('earnedPix');
  const pixScoreForCompetence = _getPixScoreForOneCompetence(realTotalPixScoreForCompetence, allowExcessPix);
  const currentLevel = _getCompetenceLevel(realTotalPixScoreForCompetence, allowExcessLevel);
  const pixAheadForNextLevel = _getPixScoreAheadOfNextLevel(pixScoreForCompetence);
  return {
    realTotalPixScoreForCompetence,
    pixScoreForCompetence,
    currentLevel,
    pixAheadForNextLevel,
  };
}

function getBlockedLevel(level: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
  return Math.min(level, MAX_REACHABLE_LEVEL);
}
function getBlockedPixScore(pixScore: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
  return Math.min(pixScore, MAX_REACHABLE_PIX_BY_COMPETENCE);
}
function _getPixScoreForOneCompetence(exactlyEarnedPix: any, allowExcessPix = false) {
  const userEarnedPix = _.floor(exactlyEarnedPix);
  if (allowExcessPix) {
    return userEarnedPix;
  }
  return getBlockedPixScore(userEarnedPix);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _getCompetenceLevel(pixScoreForCompetence: any, allowExcessLevel = false) {
  const level = _.floor(pixScoreForCompetence / PIX_COUNT_BY_LEVEL);
  if (allowExcessLevel) {
    return level;
  }
  return getBlockedLevel(level);
}

function _getPixScoreAheadOfNextLevel(earnedPix: any) {
  return earnedPix % PIX_COUNT_BY_LEVEL;
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'calculateP... Remove this comment to see the full error message
function calculatePixScore(knowledgeElements: any) {
  return _(knowledgeElements)
    .groupBy('competenceId')
    .values()
    .map((knowledgeElementsByCompetence: any) => calculateScoringInformationForCompetence({ knowledgeElements: knowledgeElementsByCompetence })
    )
    .sumBy('pixScoreForCompetence');
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  calculateScoringInformationForCompetence,
  getBlockedLevel,
  getBlockedPixScore,
  calculatePixScore,
};
