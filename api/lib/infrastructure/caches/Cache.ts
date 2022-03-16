// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Cache'.
class Cache {
  async get(/* key, generator */) {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Error'. Did you mean 'ERRORS'?
    throw new Error('Method #get(key, generator) must be overridden');
  }

  async set(/* key, object */) {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Error'. Did you mean 'ERRORS'?
    throw new Error('Method #set(key, object) must be overridden');
  }

  async flushAll() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Error'.
    throw new Error('Method #flushAll() must be overridden');
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Cache;
