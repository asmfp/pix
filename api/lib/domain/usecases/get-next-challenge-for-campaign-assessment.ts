// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentEndedError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'smartRando... Remove this comment to see the full error message
const smartRandom = require('../services/algorithm-methods/smart-random');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const flash = require('../services/algorithm-methods/flash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'dataFetche... Remove this comment to see the full error message
const dataFetcher = require('../services/algorithm-methods/data-fetcher');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getNextChallengeForCampaignAssessment({
  challengeRepository,
  answerRepository,
  flashAssessmentResultRepository,
  assessment,
  pickChallengeService,
  locale
}: any) {
  let algoResult;

  if (assessment.isFlash()) {
    const inputValues = await dataFetcher.fetchForFlashCampaigns({
      assessment,
      answerRepository,
      challengeRepository,
      flashAssessmentResultRepository,
      locale,
    });
    algoResult = flash.getPossibleNextChallenges({ ...inputValues });

    if (algoResult.hasAssessmentEnded) {
      throw new AssessmentEndedError();
    }

    return assessment.chooseNextFlashChallenge(algoResult.possibleChallenges);
  } else {
    // @ts-expect-error ts-migrate(2522) FIXME: The 'arguments' object cannot be referenced in an ... Remove this comment to see the full error message
    const inputValues = await dataFetcher.fetchForCampaigns(...arguments);
    algoResult = smartRandom.getPossibleSkillsForNextChallenge({ ...inputValues, locale });

    if (algoResult.hasAssessmentEnded) {
      throw new AssessmentEndedError();
    }

    return pickChallengeService.pickChallenge({
      skills: algoResult.possibleSkillsForNextChallenge,
      randomSeed: assessment.id,
      locale,
    });
  }
};
