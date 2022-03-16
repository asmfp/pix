// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(campaignAssessmentParticipationResult: any) {
    return new Serializer('campaign-assessment-participation-results', {
      id: 'campaignParticipationId',
      attributes: ['campaignId', 'competenceResults'],
      // @ts-expect-error ts-migrate(7030) FIXME: Not all code paths return a value.
      typeForAttribute: (attribute: any) => {
        if (attribute === 'competenceResults') return 'campaign-assessment-participation-competence-results';
      },
      competenceResults: {
        ref: 'id',
        attributes: ['name', 'index', 'areaColor', 'competenceMasteryRate'],
      },
    }).serialize(campaignAssessmentParticipationResult);
  },
};
