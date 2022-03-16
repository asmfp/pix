// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignFo... Remove this comment to see the full error message
const CampaignForCreation = require('./CampaignForCreation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Campaign'.
const Campaign = require('./Campaign');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToCreateCampaignError } = require('../errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignCr... Remove this comment to see the full error message
class CampaignCreator {
  availableTargetProfileIds: any;
  constructor(availableTargetProfileIds: any) {
    this.availableTargetProfileIds = availableTargetProfileIds;
  }

  createCampaign(campaignAttributes: any) {
    const { type, targetProfileId } = campaignAttributes;

    if (type === Campaign.types.ASSESSMENT) {
      _checkAssessmentCampaignCreatationAllowed(targetProfileId, this.availableTargetProfileIds);
    }

    return new CampaignForCreation(campaignAttributes);
  }
}

function _checkAssessmentCampaignCreatationAllowed(targetProfileId: any, availableTargetProfileIds: any) {
  if (targetProfileId && !availableTargetProfileIds.includes(targetProfileId)) {
    throw new UserNotAuthorizedToCreateCampaignError(
      `Organization does not have an access to the profile ${targetProfileId}`
    );
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignCreator;
