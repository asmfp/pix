// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findUserCampaignParticipationOverviews({
  userId,
  states,
  page,
  campaignParticipationOverviewRepository
}: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'concat' does not exist on type '{}'.
  const concatenatedStates = states ? [].concat(states) : undefined;

  const campaignParticipationOverviews = await campaignParticipationOverviewRepository.findByUserIdWithFilters({
    userId,
    states: concatenatedStates,
    page,
  });

  return campaignParticipationOverviews;
};
