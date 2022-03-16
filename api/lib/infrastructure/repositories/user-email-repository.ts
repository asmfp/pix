// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'temporaryS... Remove this comment to see the full error message
const temporaryStorage = require('../temporary-storage');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EXPIRATION... Remove this comment to see the full error message
const EXPIRATION_DELAY_SECONDS = settings.temporaryStorage.expirationDelaySeconds;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EmailModif... Remove this comment to see the full error message
const EmailModificationDemand = require('../../domain/models/EmailModificationDemand');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  saveEmailModificationDemand({
    userId,
    code,
    newEmail
  }: any) {
    const key = 'VERIFY-EMAIL-' + userId;

    return temporaryStorage.save({
      key,
      value: { code, newEmail },
      expirationDelaySeconds: EXPIRATION_DELAY_SECONDS,
    });
  },

  async getEmailModificationDemandByUserId(userId: any) {
    const key = 'VERIFY-EMAIL-' + userId;
    const emailModificationDemand = await temporaryStorage.get(key);

    if (!emailModificationDemand) return;

    return new EmailModificationDemand({
      newEmail: emailModificationDemand.newEmail,
      code: emailModificationDemand.code,
    });
  },
};
