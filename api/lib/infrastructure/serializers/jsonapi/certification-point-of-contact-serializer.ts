// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'featureTog... Remove this comment to see the full error message
const { featureToggles } = require('../../../config');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificationPointOfContact: any) {
    return new Serializer('certification-point-of-contact', {
      attributes: [
        'firstName',
        'lastName',
        'email',
        'pixCertifTermsOfServiceAccepted',
        'allowedCertificationCenterAccesses',
      ],
      allowedCertificationCenterAccesses: {
        ref: 'id',
        included: true,
        attributes: [
          'name',
          'externalId',
          'type',
          'isRelatedToManagingStudentsOrganization',
          'isAccessBlockedCollege',
          'isAccessBlockedLycee',
          'isAccessBlockedAEFE',
          'isAccessBlockedAgri',
          'relatedOrganizationTags',
          'habilitations',
          'isEndTestScreenRemovalEnabled',
        ],
      },
      typeForAttribute: function (attribute: any) {
        if (attribute === 'allowedCertificationCenterAccesses') {
          return 'allowed-certification-center-access';
        }
        return attribute;
      },
      transform(certificationPointOfContact: any) {
        const transformedCertificationPointOfContact = _.clone(certificationPointOfContact);
        transformedCertificationPointOfContact.allowedCertificationCenterAccesses = _.map(
          certificationPointOfContact.allowedCertificationCenterAccesses,
          (access: any) => {
            let habilitations = access.habilitations;
            if (!featureToggles.isComplementaryCertificationSubscriptionEnabled) {
              habilitations = [];
            }
            return {
              ...access,
              habilitations,
              isAccessBlockedCollege: access.isAccessBlockedCollege(),
              isAccessBlockedLycee: access.isAccessBlockedLycee(),
              isAccessBlockedAEFE: access.isAccessBlockedAEFE(),
              isAccessBlockedAgri: access.isAccessBlockedAgri(),
              isEndTestScreenRemovalEnabled: access.isEndTestScreenRemovalEnabled(),
            };
          }
        );

        return transformedCertificationPointOfContact;
      },
    }).serialize(certificationPointOfContact);
  },
};
