// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'temporaryS... Remove this comment to see the full error message
const temporaryStorage = require('../../infrastructure/temporary-storage');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('./token-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Unauthoriz... Remove this comment to see the full error message
const { UnauthorizedError } = require('../../application/http-errors');

async function createRefreshTokenFromUserId({
  userId,
  source
}: any) {
  const expirationDelaySeconds = settings.authentication.refreshTokenLifespanMs / 1000;
  return await temporaryStorage.save({
    value: { type: 'refresh_token', userId, source },
    expirationDelaySeconds,
  });
}

async function createAccessTokenFromRefreshToken({
  refreshToken
}: any) {
  const { userId, source } = (await temporaryStorage.get(refreshToken)) || {};
  if (!userId) throw new UnauthorizedError('Refresh token is invalid', 'INVALID_REFRESH_TOKEN');
  return tokenService.createAccessTokenFromUser(userId, source);
}

async function revokeRefreshToken({
  refreshToken
}: any) {
  await temporaryStorage.delete(refreshToken);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  createRefreshTokenFromUserId,
  createAccessTokenFromRefreshToken,
  revokeRefreshToken,
};
