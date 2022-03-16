// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { using } = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Redlock'.
const Redlock = require('redlock');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Cache'.
const Cache = require('./Cache');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RedisClien... Remove this comment to see the full error message
const RedisClient = require('../utils/RedisClient');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../logger');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');

const REDIS_LOCK_PREFIX = 'locks:';

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RedisCache... Remove this comment to see the full error message
class RedisCache extends Cache {
  _client: any;
  constructor(redis_url: any) {
    super();
    this._client = RedisCache.createClient(redis_url);
  }

  static createClient(redis_url: any) {
    return new RedisClient(redis_url, 'redis-cache-query-client');
  }

  // @ts-expect-error ts-migrate(2416) FIXME: Property 'get' in type 'RedisCache' is not assigna... Remove this comment to see the full error message
  async get(key: any, generator: any) {
    const value = await this._client.get(key);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'JSON'.
    if (value) return JSON.parse(value);

    return this._manageValueNotFoundInCache(key, generator);
  }

  // @ts-expect-error ts-migrate(7023) FIXME: '_manageValueNotFoundInCache' implicitly has retur... Remove this comment to see the full error message
  async _manageValueNotFoundInCache(key: any, generator: any) {
    const keyToLock = REDIS_LOCK_PREFIX + key;
    const retrieveAndSetValue = async () => {
      logger.info({ key }, 'Executing generator for Redis key');
      const value = await generator();
      return this.set(key, value);
    };
    const unlockErrorHandler = (err: any) => logger.error({ key }, 'Error while trying to unlock Redis key', err);

    try {
      const locker = this._client.lockDisposer(keyToLock, settings.caching.redisCacheKeyLockTTL, unlockErrorHandler);
      const value = await using(locker, retrieveAndSetValue);
      return value;
    } catch (err) {
      if (err instanceof Redlock.LockError) {
        logger.trace({ keyToLock }, 'Could not lock Redis key, waiting');
        // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
        await new Promise((resolve: any) => setTimeout(resolve, settings.caching.redisCacheLockedWaitBeforeRetry));
        return this.get(key, generator);
      }
      logger.error({ err }, 'Error while trying to update value in Redis cache');
      throw err;
    }
  }

  // @ts-expect-error ts-migrate(2416) FIXME: Property 'set' in type 'RedisCache' is not assigna... Remove this comment to see the full error message
  async set(key: any, object: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'JSON'.
    const objectAsString = JSON.stringify(object);

    logger.info({ key, length: objectAsString.length }, 'Setting Redis key');

    await this._client.set(key, objectAsString);

    return object;
  }

  flushAll() {
    logger.info('Flushing Redis database');

    return this._client.flushall();
  }

  quit() {
    this._client.quit();
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = RedisCache;
