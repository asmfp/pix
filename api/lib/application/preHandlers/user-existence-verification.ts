// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../lib/infrastructure/repositories/user-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errorSeria... Remove this comment to see the full error message
const errorSerializer = require('../../../lib/infrastructure/serializers/jsonapi/validation-error-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
const { UserNotFoundError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  verifyById(request: any, h: any) {
    return userRepository.get(request.params.id).catch((err: any) => {
      if (err instanceof UserNotFoundError) {
        const serializedError = errorSerializer.serialize(new UserNotFoundError().getErrorMessage());
        return h.response(serializedError).code(404).takeover();
      }
    });
  },
};
