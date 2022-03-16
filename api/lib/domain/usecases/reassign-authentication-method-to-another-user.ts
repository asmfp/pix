// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const { AuthenticationMethodAlreadyExistsError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function reassignAuthenticationMethodToAnotherUser({
  originUserId,
  targetUserId,
  authenticationMethodId,
  userRepository,
  authenticationMethodRepository
}: any) {
  const authenticationMethodToReassign = await authenticationMethodRepository.getByIdAndUserId({
    id: authenticationMethodId,
    userId: originUserId,
  });
  const identityProviderToReassign = authenticationMethodToReassign.identityProvider;

  await _checkIfTargetUserExists({ targetUserId, userRepository });

  await _checkIfTargetUserHasAlreadyAMethodWithIdentityProvider({
    targetUserId,
    identityProviderToReassign,
    authenticationMethodRepository,
  });

  await authenticationMethodRepository.updateAuthenticationMethodUserId({
    originUserId,
    identityProvider: identityProviderToReassign,
    targetUserId,
  });
};

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _checkIfTargetUserExists({
  targetUserId,
  userRepository
}: any) {
  await userRepository.get(targetUserId);
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _checkIfTargetUserHasAlreadyAMethodWithIdentityProvider({
  targetUserId,
  identityProviderToReassign,
  authenticationMethodRepository
}: any) {
  const targetUserAuthenticationMethods = await authenticationMethodRepository.findByUserId({ userId: targetUserId });
  const hasTargetAnAuthenticationMethodWithProvider = targetUserAuthenticationMethods.find(
    (authenticationMethod: any) => authenticationMethod.identityProvider === identityProviderToReassign
  );

  if (hasTargetAnAuthenticationMethodWithProvider) {
    throw new AuthenticationMethodAlreadyExistsError(
      `L'utilisateur ${targetUserId} a déjà une méthode de connexion ${identityProviderToReassign}.`
    );
  }
}
