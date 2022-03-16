// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, NoCampaignParticipationForUserAndCampaign } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getUserCampaignAssessmentResult({
  userId,
  campaignId,
  locale,
  participantResultRepository
}: any) {
  try {
    return await participantResultRepository.getByUserIdAndCampaignId({ userId, campaignId, locale });
  } catch (error) {
    if (error instanceof NotFoundError) throw new NoCampaignParticipationForUserAndCampaign();
    throw error;
  }
};
