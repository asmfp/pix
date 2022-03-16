// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findAnswerByChallengeAndAssessment({
  challengeId,
  assessmentId,
  userId,
  answerRepository,
  assessmentRepository
}: any = {}) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
  const integerAssessmentId = parseInt(assessmentId);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
  if (!Number.isFinite(integerAssessmentId)) {
    return null;
  }

  const ownedByUser = await assessmentRepository.ownedByUser({ id: assessmentId, userId });
  if (!ownedByUser) {
    return null;
  }

  return answerRepository.findByChallengeAndAssessment({ challengeId, assessmentId: integerAssessmentId });
};
