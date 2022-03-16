// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(campaignProfile: any) {
    return new Serializer('campaign-profiles', {
      id: 'campaignParticipationId',
      attributes: [
        'firstName',
        'lastName',
        'externalId',
        'createdAt',
        'sharedAt',
        'isShared',
        'campaignId',
        'pixScore',
        'competencesCount',
        'certifiableCompetencesCount',
        'isCertifiable',
        'competences',
      ],
      // @ts-expect-error ts-migrate(7030) FIXME: Not all code paths return a value.
      typeForAttribute: (attribute: any) => {
        if (attribute === 'competences') return 'campaign-profile-competences';
      },
      competences: {
        ref: 'id',
        attributes: ['name', 'index', 'pixScore', 'estimatedLevel', 'areaColor'],
      },
    }).serialize(campaignProfile);
  },
};
