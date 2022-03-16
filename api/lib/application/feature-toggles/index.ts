// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const featureToggleController = require('./feature-toggle-controller');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async (server: any) => {
  server.route([
    {
      method: 'GET',
      path: '/api/feature-toggles',
      config: {
        auth: false,
        handler: featureToggleController.getActiveFeatures,
        tags: ['api'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'feature-toggles-api';
