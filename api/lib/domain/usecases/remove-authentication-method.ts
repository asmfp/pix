// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../models/AuthenticationMethod');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToRemoveAuthenticationMethod } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function removeAuthenticationMethod({
  userId,
  type,
  userRepository,
  authenticationMethodRepository
}: any) {
  const user = await userRepository.get(userId);

  if (type === 'EMAIL') {
    if (!user.username) {
      await _removeAuthenticationMethod(
        userId,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
        AuthenticationMethod.identityProviders.PIX,
        authenticationMethodRepository
      );
    }
    await userRepository.updateEmail({ id: userId, email: null });
  }

  if (type === 'USERNAME') {
    if (!user.email) {
      await _removeAuthenticationMethod(
        userId,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
        AuthenticationMethod.identityProviders.PIX,
        authenticationMethodRepository
      );
    }
    await userRepository.updateUsername({ id: userId, username: null });
  }

  if (type === 'GAR') {
    await _removeAuthenticationMethod(
      userId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
      AuthenticationMethod.identityProviders.GAR,
      authenticationMethodRepository
    );
  }

  if (type === 'POLE_EMPLOI') {
    await _removeAuthenticationMethod(
      userId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
      AuthenticationMethod.identityProviders.POLE_EMPLOI,
      authenticationMethodRepository
    );
  }
};

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _removeAuthenticationMethod(userId: any, identityProvider: any, authenticationMethodRepository: any) {
  const authenticationMethods = await authenticationMethodRepository.findByUserId({ userId });

  if (authenticationMethods.length === 1) {
    throw new UserNotAuthorizedToRemoveAuthenticationMethod();
  }

  await authenticationMethodRepository.removeByUserIdAndIdentityProvider({ userId, identityProvider });
}
