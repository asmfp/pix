// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationPointOfContactSerializer = require('../../infrastructure/serializers/jsonapi/certification-point-of-contact-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;
    const certificationPointOfContact = await usecases.getCertificationPointOfContact({ userId: authenticatedUserId });
    return certificationPointOfContactSerializer.serialize(certificationPointOfContact);
  },
};
