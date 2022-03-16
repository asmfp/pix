// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Deserializ... Remove this comment to see the full error message
const { Deserializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  deserialize(payload: any) {
    return new Deserializer().deserialize(payload).then((record: any) => {
      return {
        newEmail: record['new-email'].trim()?.toLowerCase(),
        password: record['password'],
      };
    });
  },
};
