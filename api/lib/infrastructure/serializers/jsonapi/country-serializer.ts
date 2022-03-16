// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(country: any) {
    return new Serializer('country', {
      attributes: ['code', 'name'],
      transform(country: any) {
        return { ...country, id: `${country.code}_${country.matcher}` };
      },
    }).serialize(country);
  },
};
