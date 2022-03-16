// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const prescriberSerializer = require('../../infrastructure/serializers/jsonapi/prescriber-serializer');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  get(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases
      .getPrescriber({ userId: authenticatedUserId })
      .then((prescriber: any) => prescriberSerializer.serialize(prescriber));
  },
};
