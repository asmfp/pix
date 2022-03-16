// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Pack = require('../package');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('./config');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Inert = require('@hapi/inert');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Vision = require('@hapi/vision');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'monitoring... Remove this comment to see the full error message
const monitoringTools = require('./infrastructure/monitoring-tools');

function logObjectSerializer(req: any) {
  const enhancedReq = {
    ...req,
    version: settings.version,
  };

  if (!settings.hapi.enableRequestMonitoring) return enhancedReq;
  const context = monitoringTools.getContext();

  return {
    ...enhancedReq,
    user_id: monitoringTools.extractUserIdFromRequest(req),
    metrics: context?.metrics,
    route: context?.request?.route?.path,
  };
}

const plugins = [
  Inert,
  Vision,
  {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    plugin: require('hapi-i18n'),
    options: {
      locales: ['en', 'fr'],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
      directory: __dirname + '/../translations',
      defaultLocale: 'fr',
      queryParameter: 'lang',
      languageHeaderField: 'Accept-Language',
      objectNotation: true,
      updateFiles: false,
    },
  },
  {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    plugin: require('hapi-pino'),
    options: {
      serializers: {
        req: logObjectSerializer,
      },
      // Remove duplicated req property: https://github.com/pinojs/hapi-pino#optionsgetchildbindings-request---key-any-
      getChildBindings: () => ({}),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
      instance: require('./infrastructure/logger'),
      logQueryParams: true,
    },
  },
  ...(settings.sentry.enabled
    ? [
        {
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
          plugin: require('hapi-sentry'),
          options: {
            client: {
              dsn: settings.sentry.dsn,
              environment: settings.sentry.environment,
              release: `v${Pack.version}`,
              maxBreadcrumbs: settings.sentry.maxBreadcrumbs,
              debug: settings.sentry.debug,
              maxValueLength: settings.sentry.maxValueLength,
            },
            scope: {
              tags: [{ name: 'source', value: 'api' }],
            },
          },
        },
      ]
    : []),
];

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = plugins;
