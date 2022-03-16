// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificationCenterMemberships: any) {
    return new Serializer('certificationCenterMemberships', {
      transform: function (record: any) {
        record.certificationCenter.sessions = [];
        return record;
      },
      attributes: ['createdAt', 'certificationCenter', 'user'],
      certificationCenter: {
        ref: 'id',
        included: true,
        attributes: ['name', 'type', 'sessions'],
        sessions: {
          ref: 'id',
          ignoreRelationshipData: true,
          relationshipLinks: {
            related: function (record: any, current: any, parent: any) {
              return `/api/certification-centers/${parent.id}/sessions`;
            },
          },
        },
      },
      user: {
        ref: 'id',
        included: true,
        attributes: ['firstName', 'lastName', 'email'],
      },
    }).serialize(certificationCenterMemberships);
  },

  serializeMembers(certificationCenterMemberships: any) {
    return new Serializer('members', {
      transform: function (record: any) {
        const { id, firstName, lastName } = record.user;
        return { id, firstName, lastName };
      },
      ref: 'id',
      attributes: ['firstName', 'lastName'],
    }).serialize(certificationCenterMemberships);
  },
};
