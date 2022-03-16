// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findLatestOngoingUserCampaignParticipations({
  userId,
  campaignParticipationRepository
}: any) {
  return campaignParticipationRepository.findLatestOngoingByUserId(userId);
};
