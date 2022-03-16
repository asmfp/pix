// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../domain/services/token-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../infrastructure/repositories/user-repository');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async createUser(request: any, h: any) {
    const authenticationKey = request.query['authentication-key'];

    const { userId, idToken } = await usecases.createUserFromPoleEmploi({ authenticationKey });

    const accessToken = tokenService.createAccessTokenForPoleEmploi(userId);
    await userRepository.updateLastLoggedAt({ userId });

    const response = {
      access_token: accessToken,
      id_token: idToken,
    };
    return h.response(response).code(200);
  },

  async getSendings(request: any, h: any) {
    const cursor = request.query.curseur;
    const filters = _extractFilters(request);
    const { sendings, link } = await usecases.getPoleEmploiSendings({ cursor, filters });
    return h.response(sendings).header('link', link).code(200);
  },
};

function _extractFilters(request: any) {
  const filters = {};
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  if (Object.keys(request.query).includes('enErreur')) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isSuccessful' does not exist on type '{}... Remove this comment to see the full error message
    filters.isSuccessful = !request.query.enErreur;
  }
  return filters;
}
