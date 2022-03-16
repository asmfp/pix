const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
  CampaignCodeError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToAccessEntityError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
  SchoolingRegistrationDisabledError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findAssociationBetweenUserAndSchoolingRegistration({
  authenticatedUserId,
  requestedUserId,
  campaignCode,
  campaignRepository,
  schoolingRegistrationRepository
}: any) {
  if (authenticatedUserId !== requestedUserId) {
    throw new UserNotAuthorizedToAccessEntityError();
  }

  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    throw new CampaignCodeError();
  }

  const registration = await schoolingRegistrationRepository.findOneByUserIdAndOrganizationId({
    userId: authenticatedUserId,
    organizationId: campaign.organizationId,
  });

  if (registration && registration.isDisabled) {
    throw new SchoolingRegistrationDisabledError();
  }

  return registration;
};
