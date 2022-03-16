// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStarted = require('../events/CampaignParticipationStarted');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function startCampaignParticipation({
  campaignParticipation,
  userId,
  campaignParticipantRepository,
  campaignParticipationRepository,
  domainTransaction
}: any) {
  const campaignParticipant = await campaignParticipantRepository.get({
    userId,
    campaignId: campaignParticipation.campaignId,
    domainTransaction,
  });

  campaignParticipant.start({ participantExternalId: campaignParticipation.participantExternalId });

  const campaignParticipationId = await campaignParticipantRepository.save(campaignParticipant, domainTransaction);

  const createdCampaignParticipation = await campaignParticipationRepository.get(
    campaignParticipationId,
    domainTransaction
  );

  return {
    event: new CampaignParticipationStarted({ campaignParticipationId }),
    campaignParticipation: createdCampaignParticipation,
  };
};
