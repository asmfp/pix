const { Serializer } = require('jsonapi-serializer');

module.exports = {
  serialize(certificationCenterMemberships) {
    return new Serializer('certificationCenterMemberships', {
      transform: function (record) {
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
            related: function (record, current, parent) {
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

  serializeMembers(certificationCenterMemberships) {
    return new Serializer('members', {
      transform: function (record) {
        const { id, firstName, lastName } = record.user;
        return { id, firstName, lastName };
      },
      ref: 'id',
      attributes: ['firstName', 'lastName'],
    }).serialize(certificationCenterMemberships);
  },
};
