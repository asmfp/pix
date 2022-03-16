// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const redis = require('redis');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Redlock'.
const Redlock = require('redlock');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'promisify'... Remove this comment to see the full error message
const { promisify } = require('util');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../logger');

const REDIS_CLIENT_OPTIONS = {};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class RedisClient {
  _client: any;
  _clientName: any;
  _clientWithLock: any;
  del: any;
  flushall: any;
  get: any;
  lockDisposer: any;
  ping: any;
  set: any;
  constructor(redisUrl: any, clientName: any) {
    this._clientName = clientName;

    this._client = redis.createClient(redisUrl, REDIS_CLIENT_OPTIONS);

    this._client.on('connect', () => logger.info({ redisClient: this._clientName }, 'Connected to server'));
    this._client.on('end', () => logger.info({ redisClient: this._clientName }, 'Disconnected from server'));
    this._client.on('error', (err: any) => logger.warn({ redisClient: this._clientName, err }, 'Error encountered'));

    this._clientWithLock = new Redlock(
      [this._client],
      // As said in the doc, setting retryCount to 0 and treating a failure as the resource being "locked"
      // is a good practice
      { retryCount: 0 }
    );

    this.get = promisify(this._client.get).bind(this._client);
    this.set = promisify(this._client.set).bind(this._client);
    this.del = promisify(this._client.del).bind(this._client);
    this.ping = promisify(this._client.ping).bind(this._client);
    this.flushall = promisify(this._client.flushall).bind(this._client);
    this.lockDisposer = this._clientWithLock.disposer.bind(this._clientWithLock);
  }

  subscribe(channel: any) {
    this._client.subscribe(channel, () =>
      logger.info({ redisClient: this._clientName }, `Subscribed to channel '${channel}'`)
    );
  }

  publish(channel: any, message: any) {
    this._client.publish(channel, message, () =>
      logger.info({ redisClient: this._clientName }, `Published on channel '${channel}'`)
    );
  }

  on(event: any, callback: any) {
    this._client.on(event, callback);
  }

  quit() {
    this._client.quit();
  }
};
