// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../infrastructure/utils/query-params-utils');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignDetailsManagementSerializer = require('../../infrastructure/serializers/jsonapi/campaign-details-management-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const participationForCampaignManagementSerializer = require('../../infrastructure/serializers/jsonapi/participation-for-campaign-management-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const commonDeserializer = require('../../infrastructure/serializers/jsonapi/deserializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getCampaignDetails(request: any) {
    const campaignId = request.params.id;
    const campaign = await usecases.getCampaignDetailsManagement({ campaignId });
    return campaignDetailsManagementSerializer.serialize(campaign);
  },

  async findPaginatedParticipationsForCampaignManagement(request: any) {
    const campaignId = request.params.id;
    const { page } = queryParamsUtils.extractParameters(request.query);

    const { models: participationsForCampaignManagement, meta } =
      await usecases.findPaginatedParticipationsForCampaignManagement({
        campaignId,
        page,
      });
    return participationForCampaignManagementSerializer.serialize(participationsForCampaignManagement, meta);
  },

  async updateCampaignDetailsManagement(request: any, h: any) {
    const campaignId = request.params.id;

    const campaignDetailsManagement = await commonDeserializer.deserialize(request.payload);
    await usecases.updateCampaignDetailsManagement({
      campaignId,
      ...campaignDetailsManagement,
    });
    return h.response({}).code(204);
  },
};
