// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertification = require('../../../domain/models/ComplementaryCertification');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(habilitation: any) {
    return new Serializer('habilitation', {
      attributes: ['name'],
    }).serialize(habilitation);
  },

  deserialize(jsonAPI: any) {
    return new ComplementaryCertification({
      id: jsonAPI.data.id,
      name: jsonAPI.data.attributes.name,
    });
  },
};
