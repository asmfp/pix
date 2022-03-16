// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Cache'.
const Cache = require('./Cache');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LayeredCac... Remove this comment to see the full error message
class LayeredCache extends Cache {
  _firstLevelCache: any;
  _secondLevelCache: any;
  constructor(firstLevelCache: any, secondLevelCache: any) {
    super();
    this._firstLevelCache = firstLevelCache;
    this._secondLevelCache = secondLevelCache;
  }

  // @ts-expect-error ts-migrate(2416) FIXME: Property 'get' in type 'LayeredCache' is not assig... Remove this comment to see the full error message
  get(key: any, generator: any) {
    return this._firstLevelCache.get(key, () => {
      return this._secondLevelCache.get(key, generator);
    });
  }

  // @ts-expect-error ts-migrate(2416) FIXME: Property 'set' in type 'LayeredCache' is not assig... Remove this comment to see the full error message
  async set(key: any, object: any) {
    const cachedObject = await this._secondLevelCache.set(key, object);
    await this._firstLevelCache.flushAll();
    return cachedObject;
  }

  async flushAll() {
    await this._firstLevelCache.flushAll();
    return this._secondLevelCache.flushAll();
  }

  quit() {
    this._firstLevelCache.quit();
    this._secondLevelCache.quit();
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = LayeredCache;
