// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../domain/models/Organization');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../../domain/models/Tag');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(organizations: any, meta: any) {
    return new Serializer('organizations', {
      attributes: [
        'name',
        'type',
        'logoUrl',
        'externalId',
        'provinceCode',
        'isManagingStudents',
        'credit',
        'email',
        'memberships',
        'students',
        'targetProfiles',
        'tags',
        'createdBy',
        'documentationUrl',
        'showNPS',
        'formNPSUrl',
        'showSkills',
      ],
      memberships: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: any, current: any, parent: any) {
            return `/api/organizations/${parent.id}/memberships`;
          },
        },
      },
      students: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related(record: any, current: any, parent: any) {
            return `/api/organizations/${parent.id}/students`;
          },
        },
      },
      targetProfiles: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related: function (record: any, current: any, parent: any) {
            return `/api/organizations/${parent.id}/target-profiles`;
          },
        },
      },
      tags: {
        ref: 'id',
        included: true,
        attributes: ['id', 'name'],
      },
      meta,
    }).serialize(organizations);
  },

  deserialize(json: any) {
    const attributes = json.data.attributes;
    const relationships = json.data.relationships;

    let tags = [];
    if (relationships && relationships.tags) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
      tags = relationships.tags.data.map((tag: any) => new Tag({ id: parseInt(tag.id) }));
    }

    const organization = new Organization({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
      id: parseInt(json.data.id),
      name: attributes.name,
      type: attributes.type,
      email: attributes.email,
      credit: attributes.credit,
      logoUrl: attributes['logo-url'],
      externalId: attributes['external-id'],
      provinceCode: attributes['province-code'],
      isManagingStudents: attributes['is-managing-students'],
      createdBy: attributes['created-by'],
      documentationUrl: attributes['documentation-url'],
      showSkills: attributes['show-skills'],
      tags,
    });

    return organization;
  },
};
