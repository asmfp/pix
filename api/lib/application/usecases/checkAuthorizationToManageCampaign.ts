// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const prescriberRoleRepository = require('../../infrastructure/repositories/prescriber-role-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAu... Remove this comment to see the full error message
const CampaignAuthorization = require('../preHandlers/models/CampaignAuthorization');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async execute({
    userId,
    campaignId
  }: any) {
    const prescriberRole = await prescriberRoleRepository.getForCampaign({ userId, campaignId });
    return CampaignAuthorization.isAllowedToManage({ prescriberRole });
  },
};
