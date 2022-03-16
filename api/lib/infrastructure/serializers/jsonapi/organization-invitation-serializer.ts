// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer, Deserializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(invitations: any) {
    return new Serializer('organization-invitations', {
      attributes: ['organizationId', 'organizationName', 'email', 'status', 'updatedAt', 'role'],
    }).serialize(invitations);
  },

  deserializeForCreateOrganizationInvitationAndSendEmail(payload: any) {
    return new Deserializer().deserialize(payload).then((record: any) => {
      return {
        role: record.role,
        lang: record.lang,
        email: record.email?.trim().toLowerCase(),
      };
    });
  },
};
