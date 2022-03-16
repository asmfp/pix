// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'uuidv4'.
const { v4: uuidv4 } = require('uuid');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TemporaryS... Remove this comment to see the full error message
class TemporaryStorage {
  static generateKey() {
    return uuidv4();
  }

  async save(/* key, value, expirationDelaySeconds */) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Error'.
    throw new Error('Method #save({ key, value, expirationDelaySeconds }) must be overridden');
  }

  async get(/* key */) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Error'.
    throw new Error('Method #get(key) must be overridden');
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TemporaryStorage;
