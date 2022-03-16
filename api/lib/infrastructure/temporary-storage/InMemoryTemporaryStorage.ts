// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NodeCache'... Remove this comment to see the full error message
const NodeCache = require('node-cache');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'trim'.
const trim = require('lodash/trim');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TemporaryS... Remove this comment to see the full error message
const TemporaryStorage = require('./TemporaryStorage');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InMemoryTe... Remove this comment to see the full error message
class InMemoryTemporaryStorage extends TemporaryStorage {
  _client: any;
  constructor() {
    super();
    this._client = new NodeCache();
  }

  save({
    key,
    value,
    expirationDelaySeconds
  }: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'generateKey' does not exist on type 'typ... Remove this comment to see the full error message
    const storageKey = trim(key) || InMemoryTemporaryStorage.generateKey();
    this._client.set(storageKey, value, expirationDelaySeconds);
    return storageKey;
  }

  get(key: any) {
    return this._client.get(key);
  }

  delete(key: any) {
    return this._client.del(key);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = InMemoryTemporaryStorage;
