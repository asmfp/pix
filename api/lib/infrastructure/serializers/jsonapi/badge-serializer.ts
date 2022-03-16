// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(badge = {}) {
    return new Serializer('badge', {
      ref: 'id',
      attributes: ['altMessage', 'imageUrl', 'message', 'key', 'title', 'isCertifiable', 'isAlwaysVisible'],
    }).serialize(badge);
  },

  deserialize(json: any) {
    return {
      key: json.data.attributes['key'],
      altMessage: json.data.attributes['alt-message'],
      message: json.data.attributes['message'],
      title: json.data.attributes['title'],
      isCertifiable: json.data.attributes['is-certifiable'],
      isAlwaysVisible: json.data.attributes['is-always-visible'],
      imageUrl: json.data.attributes['image-url'],
    };
  },
};
