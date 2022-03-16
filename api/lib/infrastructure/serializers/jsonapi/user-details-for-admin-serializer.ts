// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserDetail... Remove this comment to see the full error message
const UserDetailsForAdmin = require('../../../domain/models/UserDetailsForAdmin');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(usersDetailsForAdmin: any) {
    return new Serializer('user', {
      attributes: [
        'firstName',
        'lastName',
        'email',
        'username',
        'cgu',
        'pixOrgaTermsOfServiceAccepted',
        'pixCertifTermsOfServiceAccepted',
        'schoolingRegistrations',
        'authenticationMethods',
      ],
      schoolingRegistrations: {
        ref: 'id',
        includes: true,
        attributes: [
          'firstName',
          'lastName',
          'birthdate',
          'division',
          'group',
          'organizationId',
          'organizationName',
          'createdAt',
          'updatedAt',
          'isDisabled',
          'canBeDissociated',
        ],
      },
      authenticationMethods: {
        ref: 'id',
        includes: true,
        attributes: ['identityProvider'],
      },
    }).serialize(usersDetailsForAdmin);
  },
  deserialize(json: any) {
    return new UserDetailsForAdmin({
      id: json.data.id,
      firstName: json.data.attributes['first-name'],
      lastName: json.data.attributes['last-name'],
      email: json.data.attributes.email,
      username: json.data.attributes.username,
    });
  },
};
