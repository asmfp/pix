// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'trim'.
const trim = require('lodash/trim');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TemporaryS... Remove this comment to see the full error message
const TemporaryStorage = require('./TemporaryStorage');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RedisClien... Remove this comment to see the full error message
const RedisClient = require('../utils/RedisClient');

const EXPIRATION_PARAMETER = 'ex';

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RedisTempo... Remove this comment to see the full error message
class RedisTemporaryStorage extends TemporaryStorage {
  _client: any;
  constructor(redisUrl: any) {
    super();
    this._client = RedisTemporaryStorage.createClient(redisUrl);
  }

  static createClient(redisUrl: any) {
    return new RedisClient(redisUrl, 'temporary-storage');
  }

  async save({
    key,
    value,
    expirationDelaySeconds
  }: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'generateKey' does not exist on type 'typ... Remove this comment to see the full error message
    const storageKey = trim(key) || RedisTemporaryStorage.generateKey();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'JSON'.
    const objectAsString = JSON.stringify(value);
    await this._client.set(storageKey, objectAsString, EXPIRATION_PARAMETER, expirationDelaySeconds);
    return storageKey;
  }

  async get(key: any) {
    const value = await this._client.get(key);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'JSON'.
    return JSON.parse(value);
  }

  async delete(key: any) {
    await this._client.del(key);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = RedisTemporaryStorage;
