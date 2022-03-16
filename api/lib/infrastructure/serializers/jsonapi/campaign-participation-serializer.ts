// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer, Deserializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Campaign'.
const Campaign = require('../../../domain/models/Campaign');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipation = require('../../../domain/models/CampaignParticipation');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(campaignParticipation: any) {
    return new Serializer('campaign-participation', {
      transform: (campaignParticipation: any) => {
        const campaignParticipationForSerialization = new CampaignParticipation(campaignParticipation);
        if (campaignParticipation.lastAssessment) {
          campaignParticipationForSerialization.assessment = { id: campaignParticipation.lastAssessment.id };
        }
        return campaignParticipationForSerialization;
      },

      attributes: ['isShared', 'sharedAt', 'createdAt', 'participantExternalId', 'campaign', 'assessment'],
      campaign: {
        ref: 'id',
        attributes: ['code', 'title', 'type'],
      },
      assessment: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related(record: any) {
            return `/api/assessments/${record.assessment.id}`;
          },
        },
      },
    }).serialize(campaignParticipation);
  },

  deserialize(json: any) {
    return new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(json).then((campaignParticipation: any) => {
      let campaign;
      if (json.data?.relationships?.campaign) {
        campaign = new Campaign({ id: json.data.relationships.campaign.data.id });
      }

      return new CampaignParticipation({ ...campaignParticipation, campaign });
    });
  },
};
