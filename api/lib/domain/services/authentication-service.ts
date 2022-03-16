// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'querystrin... Remove this comment to see the full error message
const querystring = require('querystring');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'get'.
const get = require('lodash/get');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'httpAgent'... Remove this comment to see the full error message
const httpAgent = require('../../infrastructure/http/http-agent');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'GeneratePo... Remove this comment to see the full error message
const { GeneratePoleEmploiTokensError } = require('../errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
const PoleEmploiTokens = require('../models/PoleEmploiTokens');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const encryptionService = require('./encryption-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('./token-service');

async function getUserByUsernameAndPassword({
  username,
  password,
  userRepository
}: any) {
  const foundUser = await userRepository.getByUsernameOrEmailWithRolesAndPassword(username);
  const passwordHash = foundUser.authenticationMethods[0].authenticationComplement.password;

  await encryptionService.checkPassword({
    password,
    passwordHash,
  });

  return foundUser;
}

async function generatePoleEmploiTokens({
  code,
  clientId,
  redirectUri
}: any) {
  const data = {
    client_secret: settings.poleEmploi.clientSecret,
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    redirect_uri: redirectUri,
  };

  const tokensResponse = await httpAgent.post({
    url: settings.poleEmploi.tokenUrl,
    payload: querystring.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });

  if (!tokensResponse.isSuccessful) {
    const errorMessage = _getErrorMessage(tokensResponse.data);
    throw new GeneratePoleEmploiTokensError(errorMessage, tokensResponse.code);
  }

  return new PoleEmploiTokens({
    accessToken: tokensResponse.data['access_token'],
    idToken: tokensResponse.data['id_token'],
    expiresIn: tokensResponse.data['expires_in'],
    refreshToken: tokensResponse.data['refresh_token'],
  });
}

async function getPoleEmploiUserInfo(idToken: any) {
  const { given_name, family_name, nonce, idIdentiteExterne } = await tokenService.extractPayloadFromPoleEmploiIdToken(
    idToken
  );

  return {
    firstName: given_name,
    lastName: family_name,
    externalIdentityId: idIdentiteExterne,
    nonce,
  };
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _getErrorMessage(data: any) {
  let message;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'String'.
  if (data instanceof String) {
    message = data;
  } else {
    const error = get(data, 'error', '');
    const error_description = get(data, 'error_description', '');
    message = `${error} ${error_description}`;
  }
  return message.trim();
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  generatePoleEmploiTokens,
  getPoleEmploiUserInfo,
  getUserByUsernameAndPassword,
};
