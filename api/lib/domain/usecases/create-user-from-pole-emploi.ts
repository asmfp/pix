// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'User'.
const User = require('../models/User');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../models/AuthenticationMethod');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidExt... Remove this comment to see the full error message
const { InvalidExternalAPIResponseError, AuthenticationKeyForPoleEmploiTokenExpired } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createUserFromPoleEmploi({
  authenticationKey,
  authenticationMethodRepository,
  poleEmploiTokensRepository,
  userRepository,
  authenticationService
}: any) {
  const poleEmploiTokens = await poleEmploiTokensRepository.getByKey(authenticationKey);
  if (!poleEmploiTokens) {
    throw new AuthenticationKeyForPoleEmploiTokenExpired();
  }
  const userInfo = await authenticationService.getPoleEmploiUserInfo(poleEmploiTokens.idToken);

  if (!userInfo.firstName || !userInfo.lastName || !userInfo.externalIdentityId) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'JSON'.
    logger.error(`Un des champs obligatoires n'a pas été renvoyé par /userinfo: ${JSON.stringify(userInfo)}.`);
    throw new InvalidExternalAPIResponseError('API PE: les informations utilisateurs récupérées sont incorrectes.');
  }

  const authenticationMethod = await authenticationMethodRepository.findOneByExternalIdentifierAndIdentityProvider({
    externalIdentifier: userInfo.externalIdentityId,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
    identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
  });

  if (authenticationMethod) {
    return {
      userId: authenticationMethod.userId,
      idToken: poleEmploiTokens.idToken,
    };
  }

  const user = new User({
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    cgu: true,
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    lastTermsOfServiceValidatedAt: new Date(),
  });

  let createdUserId = null;
  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  await DomainTransaction.execute(async (domainTransaction: any) => {
    createdUserId = (await userRepository.create({ user, domainTransaction })).id;

    const authenticationMethod = new AuthenticationMethod({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
      identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
      userId: createdUserId,
      externalIdentifier: userInfo.externalIdentityId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'PoleEmploiAuthenticationComplement' does... Remove this comment to see the full error message
      authenticationComplement: new AuthenticationMethod.PoleEmploiAuthenticationComplement({
        accessToken: poleEmploiTokens.accessToken,
        refreshToken: poleEmploiTokens.refreshToken,
        expiredDate: moment().add(poleEmploiTokens.expiresIn, 's').toDate(),
      }),
    });
    await authenticationMethodRepository.create({ authenticationMethod, domainTransaction });
  });

  return {
    userId: createdUserId,
    idToken: poleEmploiTokens.idToken,
  };
};
