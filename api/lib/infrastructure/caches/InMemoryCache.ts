// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NodeCache'... Remove this comment to see the full error message
const NodeCache = require('node-cache');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Cache'.
const Cache = require('./Cache');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InMemoryCa... Remove this comment to see the full error message
class InMemoryCache extends Cache {
  _cache: any;
  _queue: any;
  constructor() {
    super();
    this._cache = new NodeCache({ useClones: false });
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
    this._queue = Promise.resolve();
  }

  quit() {
    this._cache.close();
  }

  // @ts-expect-error ts-migrate(2416) FIXME: Property 'get' in type 'InMemoryCache' is not assi... Remove this comment to see the full error message
  async get(key: any, generator: any) {
    return this._syncGet(key, () =>
      this._chainPromise(() => {
        return this._syncGet(key, () => this._generateAndSet(key, generator));
      })
    );
  }

  // @ts-expect-error ts-migrate(2416) FIXME: Property 'set' in type 'InMemoryCache' is not assi... Remove this comment to see the full error message
  async set(key: any, value: any) {
    return this._chainPromise(() => {
      this._cache.set(key, value);
      return value;
    });
  }

  async flushAll() {
    return this._chainPromise(() => {
      this._cache.flushAll();
    });
  }

  async _generateAndSet(key: any, generator: any) {
    const generatedValue = await generator();
    this._cache.set(key, generatedValue);
    return generatedValue;
  }

  async _chainPromise(fn: any) {
    const queuedPromise = this._queue.then(fn);
    this._queue = queuedPromise.catch(() => {});
    return queuedPromise;
  }

  _syncGet(key: any, generator: any) {
    const value = this._cache.get(key);
    if (value) return value;
    return generator();
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = InMemoryCache;
