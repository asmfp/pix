const { expect } = require('../../../test-helper');
const { promisify } = require('util');
const config = require('../../../../lib/config');
const RedisClient = require('../../../../lib/infrastructure/utils/RedisClient');
const redis = require('redis');
const redisUrl = config.caching.redisUrl;

describe('Integration | Infrastructure | Utils | RedisClient', function () {
  let redisClient;
  let client;
  let get, set;

  beforeEach(function () {
    redisClient = new RedisClient(redisUrl, 'redis-test');
    client = redis.createClient(redisUrl, { database: 1 });
    get = promisify(client.get).bind(client);
    set = promisify(client.set).bind(client);
  });

  afterEach(function () {
    client.flushall();
  });

  describe('#get', function () {
    it('should be wrap to be promisify', async function () {
      // given
      await set('foo', 'bar');

      // when
      const result = await redisClient.get('foo');

      // then
      expect(result).to.be.equal('bar');
    });
  });

  describe('#set', function () {
    it('should be wrap to be promisify', async function () {
      // when
      const result = await redisClient.set('foo', 'bar');

      // then
      expect(result).to.be.equal('OK');
      const savedValue = await get('foo');
      expect(savedValue).to.be.equal('bar');
    });
  });

  describe('#del', function () {
    it('should be wrap to be promisify', async function () {
      // given
      await set('foo', 'bar');

      // when
      const result = await redisClient.del('foo');

      // then
      expect(result).to.be.equal(1);
      const notFound = await get('foo');
      expect(notFound).to.be.equal(null);
    });
  });

  describe('#ping', function () {
    it('should be wrap to be promisify', async function () {
      // when
      const result = await redisClient.ping();

      // then
      expect(result).to.be.equal('PONG');
    });
  });

  describe('#flushall', function () {
    it('should be wrap to be promisify', async function () {
      // when
      const result = await redisClient.flushall();

      // then
      expect(result).to.be.equal('OK');
    });
  });

  describe('#lockDisposer', function () {});
});
