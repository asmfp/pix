// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const saml = require('../../infrastructure/saml');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../domain/services/token-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  metadata(request: any, h: any) {
    return h.response(saml.getServiceProviderMetadata()).type('application/xml');
  },

  login(request: any, h: any) {
    return h.redirect(saml.createLoginRequest());
  },

  assert: async function (request: any, h: any) {
    let userAttributes;
    try {
      userAttributes = await saml.parsePostResponse(request.payload);
    } catch (e) {
      logger.error({ e }, 'SAML: Error while parsing post response');
      return h.response(e.toString()).code(400);
    }

    try {
      const redirectionUrl = await usecases.getExternalAuthenticationRedirectionUrl({
        userAttributes,
        tokenService,
        settings,
      });

      return h.redirect(redirectionUrl);
    } catch (e) {
      logger.error({ e }, 'SAML: Error while get external authentication redirection url');
      return h.response(e.toString()).code(500);
    }
  },
};
