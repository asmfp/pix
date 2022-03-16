// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const CampaignParticipationResultShared = require('./CampaignParticipationResultsShared');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function computeCampaignParticipationResults({
  event,
  participantResultsSharedRepository,
  campaignParticipationRepository
}: any) {
  const { campaignParticipationId } = event;
  const participantResultsShared = await participantResultsSharedRepository.get(campaignParticipationId);
  await campaignParticipationRepository.update(participantResultsShared);
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.eventTypes = [CampaignParticipationResultShared];
