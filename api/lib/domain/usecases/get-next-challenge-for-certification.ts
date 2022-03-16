// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function getNextChallengeForCertification({
  certificationChallengeRepository,
  challengeRepository,
  assessment
}: any) {
  return certificationChallengeRepository
    .getNextNonAnsweredChallengeByCourseId(assessment.id, assessment.certificationCourseId)
    .then((certificationChallenge: any) => {
      return challengeRepository.get(certificationChallenge.challengeId);
    });
};
