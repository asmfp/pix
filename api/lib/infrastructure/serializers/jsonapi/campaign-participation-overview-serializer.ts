// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serializeForPaginatedList(userCampaignParticipationOverviewsPaginatedList: any) {
    const { campaignParticipationOverviews, pagination } = userCampaignParticipationOverviewsPaginatedList;
    return this.serialize(campaignParticipationOverviews, pagination);
  },

  serialize(campaignParticipationOverview: any, meta: any) {
    return new Serializer('campaign-participation-overview', {
      attributes: [
        'isShared',
        'sharedAt',
        'createdAt',
        'organizationName',
        'status',
        'campaignCode',
        'campaignTitle',
        'disabledAt',
        'masteryRate',
        'validatedStagesCount',
        'totalStagesCount',
      ],
      meta,
    }).serialize(campaignParticipationOverview);
  },
};
