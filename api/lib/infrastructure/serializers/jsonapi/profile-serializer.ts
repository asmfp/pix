// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(profile = {}) {
    return new Serializer('Profile', {
      // Transform is necessary due to a bug with 'jsonapi-serializer'
      // When a nested object (here: Area) is built with a class constructor
      // in a nested object, it will skip the serialization of the area
      // But when we use plain object instead of a class then serialization works.
      transform: (profile: any) => ({
        ...profile,

        scorecards: profile.scorecards.map((scorecard: any) => ({
          ...scorecard,
          area: { ...scorecard.area }
        }))
      }),
      attributes: ['pixScore', 'scorecards'],
      scorecards: {
        ref: 'id',
        attributes: [
          'name',
          'description',
          'index',
          'competenceId',
          'earnedPix',
          'level',
          'pixScoreAheadOfNextLevel',
          'status',
          'remainingDaysBeforeReset',
          'remainingDaysBeforeImproving',
          'area',
        ],
        area: {
          ref: 'id',
          attributes: ['code', 'title', 'color'],
        },
      },
    }).serialize(profile);
  },
};
