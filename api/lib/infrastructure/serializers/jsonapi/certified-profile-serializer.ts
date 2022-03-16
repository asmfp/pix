// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const kebabCase = require('lodash/kebabCase');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'typeForAtt... Remove this comment to see the full error message
const typeForAttribute = (attribute: any) => {
  return kebabCase(attribute);
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certifiedProfile: any) {
    return new Serializer('certified-profiles', {
      typeForAttribute,
      attributes: ['userId', 'certifiedSkills', 'certifiedTubes', 'certifiedCompetences', 'certifiedAreas'],
      certifiedSkills: {
        ref: 'id',
        included: true,
        attributes: ['name', 'tubeId', 'hasBeenAskedInCertif', 'difficulty'],
      },
      certifiedTubes: {
        ref: 'id',
        included: true,
        attributes: ['name', 'competenceId'],
      },
      certifiedCompetences: {
        ref: 'id',
        included: true,
        attributes: ['name', 'areaId'],
      },
      certifiedAreas: {
        ref: 'id',
        included: true,
        attributes: ['name', 'color'],
      },
    }).serialize(certifiedProfile);
  },
};
