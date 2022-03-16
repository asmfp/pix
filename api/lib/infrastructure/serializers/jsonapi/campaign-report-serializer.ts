// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(campaignReports: any, meta: any, {
    tokenForCampaignResults
  }: any = {}) {
    return new Serializer('campaign', {
      transform: (record: any) => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        const campaign = Object.assign({}, record);
        campaign.tokenForCampaignResults = tokenForCampaignResults;
        campaign.isArchived = record.isArchived;
        return campaign;
      },
      attributes: [
        'name',
        'code',
        'title',
        'type',
        'createdAt',
        'customLandingPageText',
        'isArchived',
        'tokenForCampaignResults',
        'idPixLabel',
        'targetProfileId',
        'targetProfileDescription',
        'targetProfileName',
        'targetProfileTubesCount',
        'targetProfileThematicResultCount',
        'targetProfileHasStage',
        'ownerId',
        'ownerLastName',
        'ownerFirstName',
        'participationsCount',
        'sharedParticipationsCount',
        'averageResult',
        'campaignCollectiveResult',
        'campaignAnalysis',
        'divisions',
        'stages',
        'badges',
        'groups',
        'multipleSendings',
      ],
      stages: {
        ref: 'id',
        included: true,
        attributes: ['prescriberTitle', 'prescriberDescription', 'threshold'],
      },
      badges: {
        ref: 'id',
        included: true,
        attributes: ['title'],
      },
      campaignCollectiveResult: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: any, current: any, parent: any) {
            return `/api/campaigns/${parent.id}/collective-results`;
          },
        },
      },
      campaignAnalysis: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: any, current: any, parent: any) {
            return `/api/campaigns/${parent.id}/analyses`;
          },
        },
      },
      divisions: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: any, current: any, parent: any) {
            return `/api/campaigns/${parent.id}/divisions`;
          },
        },
      },
      groups: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: any, current: any, parent: any) {
            return `/api/campaigns/${parent.id}/groups`;
          },
        },
      },
      meta,
    }).serialize(campaignReports);
  },
};
