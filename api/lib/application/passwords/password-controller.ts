// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const passwordResetSerializer = require('../../infrastructure/serializers/jsonapi/password-reset-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'userSerial... Remove this comment to see the full error message
const userSerializer = require('../../infrastructure/serializers/jsonapi/user-serializer');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async createResetDemand(request: any, h: any) {
    const { email } = request.payload.data.attributes;
    const locale = extractLocaleFromRequest(request);

    const passwordResetDemand = await usecases.createPasswordResetDemand({
      email,
      locale,
    });
    const serializedPayload = passwordResetSerializer.serialize(passwordResetDemand.attributes);

    return h.response(serializedPayload).created();
  },

  async checkResetDemand(request: any) {
    const temporaryKey = request.params.temporaryKey;
    const user = await usecases.getUserByResetPasswordDemand({ temporaryKey });
    return userSerializer.serialize(user);
  },

  async updateExpiredPassword(request: any, h: any) {
    const { username, expiredPassword, newPassword } = request.payload.data.attributes;
    await usecases.updateExpiredPassword({ username, expiredPassword, newPassword });

    return h.response({ data: { type: 'reset-expired-password-demands' } }).created();
  },
};
