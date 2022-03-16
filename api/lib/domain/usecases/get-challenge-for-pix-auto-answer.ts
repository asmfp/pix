// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getChallengeForPixAutoAnswer({
  assessmentId,
  assessmentRepository,
  challengeForPixAutoAnswerRepository
}: any) {
  const assessment = await assessmentRepository.get(assessmentId);
  if (!assessment) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`Assessment not found for ID ${assessmentId}`);
  }

  const lastChallengeId = assessment.lastChallengeId;
  return challengeForPixAutoAnswerRepository.get(lastChallengeId);
};
