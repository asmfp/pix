// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'temporaryS... Remove this comment to see the full error message
const temporaryStorage = require('../temporary-storage');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EXPIRATION... Remove this comment to see the full error message
const EXPIRATION_DELAY_SECONDS = settings.poleEmploi.temporaryStorage.expirationDelaySeconds;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  save(poleEmploiTokens: any) {
    return temporaryStorage.save({
      value: poleEmploiTokens,
      expirationDelaySeconds: EXPIRATION_DELAY_SECONDS,
    });
  },

  getByKey(key: any) {
    return temporaryStorage.get(key);
  },
};
