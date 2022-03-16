// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Unexpected... Remove this comment to see the full error message
const { UnexpectedPoleEmploiStateError, UnexpectedUserAccountError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../models/AuthenticationMethod');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function authenticatePoleEmploiUser({
  authenticatedUserId,
  clientId,
  code,
  redirectUri,
  stateReceived,
  stateSent,
  authenticationService,
  tokenService,
  authenticationMethodRepository,
  poleEmploiTokensRepository,
  userRepository
}: any) {
  if (stateSent !== stateReceived) {
    logger.error(`State sent ${stateSent} did not match the state received ${stateReceived}`);
    throw new UnexpectedPoleEmploiStateError();
  }

  const poleEmploiTokens = await authenticationService.generatePoleEmploiTokens({ code, clientId, redirectUri });

  const userInfo = await authenticationService.getPoleEmploiUserInfo(poleEmploiTokens.idToken);

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'PoleEmploiAuthenticationComplement' does... Remove this comment to see the full error message
  const authenticationComplement = new AuthenticationMethod.PoleEmploiAuthenticationComplement({
    accessToken: poleEmploiTokens.accessToken,
    refreshToken: poleEmploiTokens.refreshToken,
    expiredDate: moment().add(poleEmploiTokens.expiresIn, 's').toDate(),
  });

  let pixAccessToken;

  if (authenticatedUserId) {
    pixAccessToken = await _getPixAccessTokenFromAlreadyAuthenticatedPixUser({
      userInfo,
      authenticatedUserId,
      authenticationComplement,
      authenticationMethodRepository,
      userRepository,
      tokenService,
    });
  } else {
    const user = await userRepository.findByPoleEmploiExternalIdentifier(userInfo.externalIdentityId);

    if (!user) {
      const authenticationKey = await poleEmploiTokensRepository.save(poleEmploiTokens);
      return { authenticationKey }; // todo : refacto, should not return different objects
      // will be refacto when keycloak will be setup
      // this return should be replaced by domain error (see controller)
    } else {
      pixAccessToken = await _getPixAccessTokenFromPoleEmploiUser({
        user,
        authenticationComplement,
        authenticationMethodRepository,
        userRepository,
        tokenService,
      });
    }
  }

  return {
    pixAccessToken,
    poleEmploiTokens,
  };
};

function _buildPoleEmploiAuthenticationMethod({
  userInfo,
  authenticationComplement,
  userId
}: any) {
  return new AuthenticationMethod({
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
    identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
    userId,
    externalIdentifier: userInfo.externalIdentityId,
    authenticationComplement,
  });
}

async function _getPixAccessTokenFromAlreadyAuthenticatedPixUser({
  userInfo,
  authenticatedUserId,
  authenticationComplement,
  authenticationMethodRepository,
  userRepository,
  tokenService
}: any) {
  const authenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
    userId: authenticatedUserId,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
    identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
  });

  if (authenticationMethod) {
    if (authenticationMethod.externalIdentifier !== userInfo.externalIdentityId) {
      throw new UnexpectedUserAccountError({ message: "Le compte Pix connecté n'est pas celui qui est attendu." });
    }

    await authenticationMethodRepository.updatePoleEmploiAuthenticationComplementByUserId({
      authenticationComplement,
      userId: authenticatedUserId,
    });
  } else {
    const authenticationMethod = _buildPoleEmploiAuthenticationMethod({
      userInfo,
      authenticationComplement,
      userId: authenticatedUserId,
    });
    await authenticationMethodRepository.create({ authenticationMethod });
  }
  const pixAccessToken = tokenService.createAccessTokenForPoleEmploi(authenticatedUserId);
  await userRepository.updateLastLoggedAt({ userId: authenticatedUserId });
  return pixAccessToken;
}

async function _getPixAccessTokenFromPoleEmploiUser({
  user,
  authenticationComplement,
  authenticationMethodRepository,
  userRepository,
  tokenService
}: any) {
  await authenticationMethodRepository.updatePoleEmploiAuthenticationComplementByUserId({
    authenticationComplement,
    userId: user.id,
  });
  const pixAccessToken = tokenService.createAccessTokenForPoleEmploi(user.id);

  await userRepository.updateLastLoggedAt({ userId: user.id });
  return pixAccessToken;
}
