// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentEndedError, UserNotAuthorizedToAccessEntityError } = require('../errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'smartRando... Remove this comment to see the full error message
const smartRandom = require('../services/algorithm-methods/smart-random');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'dataFetche... Remove this comment to see the full error message
const dataFetcher = require('../services/algorithm-methods/data-fetcher');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getNextChallengeForCompetenceEvaluation({
  pickChallengeService,
  assessment,
  userId,
  locale
}: any) {
  _checkIfAssessmentBelongsToUser(assessment, userId);
  // @ts-expect-error ts-migrate(2522) FIXME: The 'arguments' object cannot be referenced in an ... Remove this comment to see the full error message
  const inputValues = await dataFetcher.fetchForCompetenceEvaluations(...arguments);

  const { possibleSkillsForNextChallenge, hasAssessmentEnded } = smartRandom.getPossibleSkillsForNextChallenge({
    ...inputValues,
    locale,
  });

  if (hasAssessmentEnded) {
    throw new AssessmentEndedError();
  }

  return pickChallengeService.pickChallenge({
    skills: possibleSkillsForNextChallenge,
    randomSeed: assessment.id,
    locale: locale,
  });
};

function _checkIfAssessmentBelongsToUser(assessment: any, userId: any) {
  if (assessment.userId !== userId) {
    throw new UserNotAuthorizedToAccessEntityError();
  }
}
