// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(authentications: any) {
    return new Serializer('authentication', {
      attributes: ['token', 'user_id', 'password'],
      transform(model: any) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        const authentication = Object.assign({}, model.toJSON());
        authentication.user_id = model.userId.toString();
        authentication.id = model.userId;
        authentication.password = '';
        return authentication;
      },
    }).serialize(authentications);
  },
};
