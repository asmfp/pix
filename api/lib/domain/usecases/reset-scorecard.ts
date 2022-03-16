// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
const Scorecard = require('../models/Scorecard');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const { CompetenceResetError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function resetScorecard({
  userId,
  competenceId,
  scorecardService,
  competenceRepository,
  competenceEvaluationRepository,
  knowledgeElementRepository,
  assessmentRepository,
  campaignParticipationRepository,
  targetProfileRepository,
  locale
}: any) {
  const knowledgeElements = await knowledgeElementRepository.findUniqByUserIdAndCompetenceId({
    userId,
    competenceId,
  });

  const nothingToReset = _.isEmpty(knowledgeElements);
  if (nothingToReset) {
    return null;
  }

  const remainingDaysBeforeReset = Scorecard.computeRemainingDaysBeforeReset(knowledgeElements);
  if (remainingDaysBeforeReset > 0) {
    throw new CompetenceResetError(remainingDaysBeforeReset);
  }

  const isCompetenceEvaluationExists = await competenceEvaluationRepository.existsByCompetenceIdAndUserId({
    competenceId,
    userId,
  });

  await scorecardService.resetScorecard({
    competenceId,
    userId,
    shouldResetCompetenceEvaluation: isCompetenceEvaluationExists,
    assessmentRepository,
    campaignParticipationRepository,
    competenceRepository,
    competenceEvaluationRepository,
    knowledgeElementRepository,
    targetProfileRepository,
  });

  return scorecardService.computeScorecard({
    userId,
    competenceId,
    competenceRepository,
    competenceEvaluationRepository,
    knowledgeElementRepository,
    locale,
  });
};
