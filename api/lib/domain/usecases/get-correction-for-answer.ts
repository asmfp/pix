// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentNotCompletedError, NotFoundError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCorrectionForAnswer({
  assessmentRepository,
  answerRepository,
  correctionRepository,
  answerId,
  userId,
  locale
}: any = {}) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
  const integerAnswerId = parseInt(answerId);

  const answer = await answerRepository.get(integerAnswerId);
  const assessment = await assessmentRepository.get(answer.assessmentId);

  if (assessment.userId !== userId) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`Not found correction for answer of ID ${answerId}`);
  }

  // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 3.
  _validateCorrectionIsAccessible(assessment, userId, integerAnswerId);

  return correctionRepository.getByChallengeId({ challengeId: answer.challengeId, userId, locale });
};

function _validateCorrectionIsAccessible(assessment: any) {
  if (assessment.isForCampaign() || assessment.isCompetenceEvaluation()) {
    return;
  }

  if (!assessment.isCompleted()) {
    throw new AssessmentNotCompletedError();
  }
}
