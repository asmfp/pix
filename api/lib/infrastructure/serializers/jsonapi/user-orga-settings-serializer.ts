// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(userOrgaSettings: any) {
    return new Serializer('user-orga-settings', {
      transform(record: any) {
        if (!record.user) {
          delete record.user;
        }

        record.organization = record.currentOrganization;
        return record;
      },
      attributes: ['organization', 'user'],
      organization: {
        ref: 'id',
        included: true,
        attributes: [
          'code',
          'name',
          'type',
          'isManagingStudents',
          'externalId',
          'campaigns',
          'targetProfiles',
          'memberships',
          'students',
          'organizationInvitations',
        ],
        campaigns: {
          ref: 'id',
          ignoreRelationshipData: true,
          nullIfMissing: true,
          relationshipLinks: {
            related: function (record: any, current: any, parent: any) {
              return `/api/organizations/${parent.id}/campaigns`;
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
        memberships: {
          ref: 'id',
          ignoreRelationshipData: true,
          nullIfMissing: true,
          relationshipLinks: {
            related: function (record: any, current: any, parent: any) {
              return `/api/organizations/${parent.id}/memberships`;
            },
          },
        },
        students: {
          ref: 'id',
          ignoreRelationshipData: true,
          nullIfMissing: true,
          relationshipLinks: {
            related: function (record: any, current: any, parent: any) {
              return `/api/organizations/${parent.id}/students`;
            },
          },
        },
        organizationInvitations: {
          ref: 'id',
          ignoreRelationshipData: true,
          nullIfMissing: true,
          relationshipLinks: {
            related: function (record: any, current: any, parent: any) {
              return `/api/organizations/${parent.id}/invitations`;
            },
          },
        },
      },
      user: {
        ref: 'id',
        included: true,
        attributes: ['firstName', 'lastName', 'email'],
      },
    }).serialize(userOrgaSettings);
  },
};
