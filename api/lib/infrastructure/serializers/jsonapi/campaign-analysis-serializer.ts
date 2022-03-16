// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tutorialAt... Remove this comment to see the full error message
const tutorialAttributes = require('./tutorial-attributes');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(results: any) {
    return new Serializer('campaign-analysis', {
      attributes: ['campaignTubeRecommendations'],
      campaignTubeRecommendations: {
        ref: 'id',
        includes: true,
        attributes: [
          'tubeId',
          'competenceId',
          'competenceName',
          'tubePracticalTitle',
          'areaColor',
          'averageScore',
          'tutorials',
          'tubeDescription',
        ],
        tutorials: tutorialAttributes,
      },
    }).serialize(results);
  },
};
