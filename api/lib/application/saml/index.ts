// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const samlController = require('./saml-controller');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'GET',
      path: '/api/saml/metadata.xml',
      config: {
        auth: false,
        handler: samlController.metadata,
        tags: ['api'],
      },
    },

    {
      method: 'GET',
      path: '/api/saml/login',
      config: {
        auth: false,
        handler: samlController.login,
        tags: ['api'],
      },
    },

    {
      method: 'POST',
      path: '/api/saml/assert',
      config: {
        auth: false,
        handler: samlController.assert,
        tags: ['api'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'saml-api';
