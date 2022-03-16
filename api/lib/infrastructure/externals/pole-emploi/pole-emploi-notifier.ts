// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'get'.
const get = require('lodash/get');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'querystrin... Remove this comment to see the full error message
const querystring = require('querystring');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'monitoring... Remove this comment to see the full error message
const monitoringTools = require('../../monitoring-tools');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationMethodRepository = require('../../repositories/authentication-method-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../domain/models/AuthenticationMethod');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'httpAgent'... Remove this comment to see the full error message
const httpAgent = require('../../http/http-agent');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../config');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Unexpected... Remove this comment to see the full error message
const { UnexpectedUserAccountError } = require('../../../domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async notify(userId: any, payload: any) {
    const authenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
      userId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
      identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
    });
    let accessToken = get(authenticationMethod, 'authenticationComplement.accessToken');
    if (!accessToken) {
      throw new UnexpectedUserAccountError({
        message: "Le compte utilisateur n'est pas rattaché à l'organisation Pôle Emploi",
      });
    }

    const expiredDate = get(authenticationMethod, 'authenticationComplement.expiredDate');
    const refreshToken = get(authenticationMethod, 'authenticationComplement.refreshToken');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    if (!refreshToken || new Date(expiredDate) <= new Date()) {
      const data = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_secret: settings.poleEmploi.clientSecret,
        client_id: settings.poleEmploi.clientId,
      };

      const tokenResponse = await httpAgent.post({
        url: settings.poleEmploi.tokenUrl,
        payload: querystring.stringify(data),
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      });

      if (!tokenResponse.isSuccessful) {
        const errorMessage = _getErrorMessage(tokenResponse.data);
        monitoringTools.logErrorWithCorrelationIds({ message: errorMessage });
        return {
          isSuccessful: tokenResponse.isSuccessful,
          code: tokenResponse.code || '500',
        };
      }

      accessToken = tokenResponse.data['access_token'];
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'PoleEmploiAuthenticationComplement' does... Remove this comment to see the full error message
      const authenticationComplement = new AuthenticationMethod.PoleEmploiAuthenticationComplement({
        accessToken,
        refreshToken: tokenResponse.data['refresh_token'],
        expiredDate: moment().add(tokenResponse.data['expires_in'], 's').toDate(),
      });
      await authenticationMethodRepository.updatePoleEmploiAuthenticationComplementByUserId({
        authenticationComplement,
        userId,
      });
    }

    const url = settings.poleEmploi.sendingUrl;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      Accept: 'application/json',
      'Service-source': 'Pix',
    };

    const httpResponse = await httpAgent.post({ url, payload, headers });

    if (!httpResponse.isSuccessful) {
      const errorMessage = _getErrorMessage(httpResponse.data);
      monitoringTools.logErrorWithCorrelationIds({ message: errorMessage });
    }

    return {
      isSuccessful: httpResponse.isSuccessful,
      code: httpResponse.code || '500',
    };
  },
};

function _getErrorMessage(data: any) {
  let message;

  if (typeof data === 'string') {
    message = data;
  } else {
    const error = get(data, 'error', '');
    const error_description = get(data, 'error_description', '');
    message = `${error} ${error_description}`;
  }
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'trim' does not exist on type 'string'.
  return message.trim();
}
