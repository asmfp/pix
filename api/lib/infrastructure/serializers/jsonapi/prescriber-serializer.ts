// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(prescriber: any) {
    return new Serializer('prescriber', {
      transform: (record: any) => {
        const recordWithoutClass = { ...record };
        recordWithoutClass.memberships.forEach((membership: any) => {
          membership.organization = { ...membership.organization };
        });
        recordWithoutClass.userOrgaSettings = {
          ...recordWithoutClass.userOrgaSettings,
          organization: {
            ...recordWithoutClass.userOrgaSettings.currentOrganization,
            isAgriculture: recordWithoutClass.userOrgaSettings.currentOrganization.isAgriculture,
          },
        };
        delete recordWithoutClass.userOrgaSettings.currentOrganization;

        return recordWithoutClass;
      },

      attributes: [
        'firstName',
        'lastName',
        'pixOrgaTermsOfServiceAccepted',
        'areNewYearSchoolingRegistrationsImported',
        'lang',
        'memberships',
        'userOrgaSettings',
      ],
      memberships: {
        ref: 'id',
        attributes: ['organizationRole', 'organization'],
        organization: {
          ref: 'id',
          attributes: ['name', 'externalId'],
        },
      },
      userOrgaSettings: {
        ref: 'id',
        attributes: ['organization', 'user'],
        organization: {
          ref: 'id',
          attributes: [
            'name',
            'type',
            'credit',
            'isManagingStudents',
            'isAgriculture',
            'targetProfiles',
            'memberships',
            'students',
            'divisions',
            'organizationInvitations',
            'documentationUrl',
            'groups',
          ],
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
          groups: {
            ref: 'id',
            ignoreRelationshipData: true,
            nullIfMissing: true,
            relationshipLinks: {
              related: function (record: any, current: any, parent: any) {
                return `/api/organizations/${parent.id}/groups`;
              },
            },
          },
          divisions: {
            ref: 'id',
            ignoreRelationshipData: true,
            nullIfMissing: true,
            relationshipLinks: {
              related(record: any, current: any, parent: any) {
                return `/api/organizations/${parent.id}/divisions`;
              },
            },
          },
        },
      },
    }).serialize(prescriber);
  },
};
