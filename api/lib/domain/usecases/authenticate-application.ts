const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Applicatio... Remove this comment to see the full error message
  ApplicationScopeNotAllowedError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Applicatio... Remove this comment to see the full error message
  ApplicationWithInvalidClientIdError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Applicatio... Remove this comment to see the full error message
  ApplicationWithInvalidClientSecretError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'find'.
const { find } = require('lodash');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { graviteeRegisterApplicationsCredentials, jwtConfig } = require('../../config');

function _checkClientId(application: any, clientId: any) {
  if (!application || application.clientId !== clientId) {
    throw new ApplicationWithInvalidClientIdError('The client ID is invalid.');
  }
}

function _checkClientSecret(application: any, clientSecret: any) {
  if (application.clientSecret !== clientSecret) {
    throw new ApplicationWithInvalidClientSecretError('The client secret is invalid.');
  }
}

function _checkAppScope(application: any, scope: any) {
  if (application.scope !== scope) {
    throw new ApplicationScopeNotAllowedError('The scope is invalid.');
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function authenticateApplication({
  clientId,
  clientSecret,
  scope,
  tokenService
}: any) {
  const application = find(graviteeRegisterApplicationsCredentials, { clientId });
  _checkClientId(application, clientId);
  _checkClientSecret(application, clientSecret);
  _checkAppScope(application, scope);

  return tokenService.createAccessTokenFromApplication(
    clientId,
    application.source,
    scope,
    jwtConfig[application.source].secret,
    jwtConfig[application.source].tokenLifespan
  );
};
