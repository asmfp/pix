// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Boom'.
const Boom = require('boom');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const packageJSON = require('../../../package.json');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const redisMonitor = require('../../infrastructure/utils/redis-monitor');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  get(request: any) {
    return {
      name: packageJSON.name,
      version: packageJSON.version,
      description: packageJSON.description,
      environment: settings.environment,
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      'container-version': process.env.CONTAINER_VERSION,
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      'container-app-name': process.env.APP,
      'current-lang': request.i18n.__('current-lang'),
    };
  },

  async checkDbStatus() {
    try {
      await knex.raw('SELECT 1 FROM knex_migrations_lock');
      return { message: 'Connection to database ok' };
    } catch (err) {
      throw Boom.serverUnavailable('Connection to database failed');
    }
  },

  async checkRedisStatus() {
    try {
      await redisMonitor.ping();
      return { message: 'Connection to Redis ok' };
    } catch (err) {
      throw Boom.serverUnavailable('Connection to Redis failed');
    }
  },

  crashTest() {
    throw Boom.internal();
  },
};
