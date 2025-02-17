const { Serializer } = require('jsonapi-serializer');

module.exports = {
  serialize(users, meta) {
    return new Serializer('user', {
      transform(record) {
        record.profile = null;
        return record;
      },
      attributes: [
        'firstName',
        'lastName',
        'email',
        'username',
        'cgu',
        'lastTermsOfServiceValidatedAt',
        'mustValidateTermsOfService',
        'pixOrgaTermsOfServiceAccepted',
        'pixCertifTermsOfServiceAccepted',
        'lang',
        'isAnonymous',
        'memberships',
        'certificationCenterMemberships',
        'pixScore',
        'scorecards',
        'profile',
        'hasSeenAssessmentInstructions',
        'isCertifiable',
        'hasSeenNewDashboardInfo',
        'hasSeenFocusedChallengeTooltip',
        'hasSeenOtherChallengesTooltip',
        'hasAssessmentParticipations',
        'codeForLastProfileToShare',
      ],
      memberships: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related(record, current, parent) {
            return `/api/users/${parent.id}/memberships`;
          },
        },
      },
      certificationCenterMemberships: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record, current, parent) {
            return `/api/users/${parent.id}/certification-center-memberships`;
          },
        },
      },
      pixScore: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record, current, parent) {
            return `/api/users/${parent.id}/pixscore`;
          },
        },
      },
      scorecards: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record, current, parent) {
            return `/api/users/${parent.id}/scorecards`;
          },
        },
      },
      profile: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record, current, parent) {
            return `/api/users/${parent.id}/profile`;
          },
        },
      },
      isCertifiable: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related: function (record, current, parent) {
            return `/api/users/${parent.id}/is-certifiable`;
          },
        },
      },
      meta,
    }).serialize(users);
  },
};
