// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToUpdateResourceError, EntityValidationError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'campaignVa... Remove this comment to see the full error message
const campaignValidator = require('../validators/campaign-validator');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateCampaign({
  userId,
  campaignId,
  name,
  title,
  customLandingPageText,
  ownerId,
  userRepository,
  campaignRepository,
  membershipRepository
}: any) {
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  const [user, campaign] = await Promise.all([
    userRepository.getWithMemberships(userId),
    campaignRepository.get(campaignId),
  ]);

  const organizationId = campaign.organizationId;
  if (!user.hasAccessToOrganization(organizationId)) {
    throw new UserNotAuthorizedToUpdateResourceError(
      `User does not have an access to the organization ${organizationId}`
    );
  }

  const ownerMembership = await membershipRepository.findByUserIdAndOrganizationId({
    userId: ownerId,
    organizationId,
  });

  if (_.isEmpty(ownerMembership)) {
    throw new EntityValidationError({
      invalidAttributes: [{ attribute: 'ownerId', message: 'OWNER_NOT_IN_ORGANIZATION' }],
    });
  }

  if (name !== undefined) campaign.name = name;
  if (title !== undefined) campaign.title = title;
  if (customLandingPageText !== undefined) campaign.customLandingPageText = customLandingPageText;
  if (ownerId !== undefined) campaign.ownerId = ownerId;

  const rawCampaign = {
    ...campaign,
    creatorId: campaign.creator.id,
    organizationId,
    targetProfileId: _.get(campaign, 'targetProfile.id'),
  };
  campaignValidator.validate(rawCampaign);
  await campaignRepository.update(campaign);

  return campaign;
};
