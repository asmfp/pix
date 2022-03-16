// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(targetProfiles: any, meta: any) {
    return new Serializer('target-profile', {
      attributes: ['name', 'outdated', 'isPublic', 'ownerOrganizationId', 'isSimplifiedAccess'],
      meta,
    }).serialize(targetProfiles);
  },

  deserialize(json: any) {
    return {
      name: json.data.attributes['name'],
      ownerOrganizationId: json.data.attributes['owner-organization-id'],
      isPublic: json.data.attributes['is-public'],
      imageUrl: json.data.attributes['image-url'],
      skillIds: json.data.attributes['skill-ids'],
      comment: json.data.attributes['comment'],
      description: json.data.attributes['description'],
      category: json.data.attributes['category'],
    };
  },
};
