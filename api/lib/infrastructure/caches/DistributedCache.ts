// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Cache'.
const Cache = require('./Cache');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RedisClien... Remove this comment to see the full error message
const RedisClient = require('../utils/RedisClient');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Distribute... Remove this comment to see the full error message
class DistributedCache extends Cache {
  _channel: any;
  _redisClientPublisher: any;
  _redisClientSubscriber: any;
  _underlyingCache: any;
  constructor(underlyingCache: any, redisUrl: any, channel: any) {
    super();

    this._underlyingCache = underlyingCache;

    this._redisClientPublisher = new RedisClient(redisUrl, 'distributed-cache-publisher');
    this._redisClientSubscriber = new RedisClient(redisUrl, 'distributed-cache-subscriber');
    this._channel = channel;

    this._redisClientSubscriber.on('ready', () => {
      this._redisClientSubscriber.subscribe(this._channel);
    });
    this._redisClientSubscriber.on('message', () => {
      return this._underlyingCache.flushAll();
    });
  }

  // @ts-expect-error ts-migrate(2416) FIXME: Property 'get' in type 'DistributedCache' is not a... Remove this comment to see the full error message
  get(key: any, generator: any) {
    return this._underlyingCache.get(key, generator);
  }

  // @ts-expect-error ts-migrate(2416) FIXME: Property 'set' in type 'DistributedCache' is not a... Remove this comment to see the full error message
  set(key: any, object: any) {
    return this._underlyingCache.set(key, object);
  }

  flushAll() {
    return this._redisClientPublisher.publish(this._channel, 'Flush all');
  }

  quit() {
    this._underlyingCache.quit();
    this._redisClientPublisher.quit();
    this._redisClientSubscriber.quit();
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = DistributedCache;
