// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'jsonwebtok... Remove this comment to see the full error message
const jsonwebtoken = require('jsonwebtoken');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const passwordResetDemandRepository = require('../../infrastructure/repositories/reset-password-demands-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'crypto'.
const crypto = require('crypto');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  generateTemporaryKey() {
    return jsonwebtoken.sign(
      {
        data: crypto.randomBytes(16).toString('base64'),
      },
      settings.temporaryKey.secret,
      { expiresIn: settings.temporaryKey.tokenLifespan }
    );
  },

  invalidateOldResetPasswordDemand(userEmail: any) {
    return passwordResetDemandRepository.markAsBeingUsed(userEmail);
  },

  verifyDemand(temporaryKey: any) {
    return passwordResetDemandRepository
      .findByTemporaryKey(temporaryKey)
      .then((fetchedDemand: any) => fetchedDemand.toJSON());
  },

  hasUserAPasswordResetDemandInProgress(email: any, temporaryKey: any) {
    return passwordResetDemandRepository.findByUserEmail(email, temporaryKey);
  },
};
