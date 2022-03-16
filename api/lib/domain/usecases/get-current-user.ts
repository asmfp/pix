// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserWithAc... Remove this comment to see the full error message
const UserWithActivity = require('../read-models/UserWithActivity');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCurrentUser({
  authenticatedUserId,
  userRepository,
  campaignParticipationRepository
}: any) {
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  const [hasAssessmentParticipations, codeForLastProfileToShare] = await Promise.all([
    campaignParticipationRepository.hasAssessmentParticipations(authenticatedUserId),
    campaignParticipationRepository.getCodeOfLastParticipationToProfilesCollectionCampaignForUser(authenticatedUserId),
  ]);
  const user = await userRepository.get(authenticatedUserId);
  return new UserWithActivity({
    user,
    hasAssessmentParticipations,
    codeForLastProfileToShare,
  });
};
