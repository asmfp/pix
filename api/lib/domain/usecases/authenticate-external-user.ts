const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MissingOrI... Remove this comment to see the full error message
  MissingOrInvalidCredentialsError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PasswordNo... Remove this comment to see the full error message
  PasswordNotMatching,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserShould... Remove this comment to see the full error message
  UserShouldChangePasswordError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Unexpected... Remove this comment to see the full error message
  UnexpectedUserAccountError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidExt... Remove this comment to see the full error message
  InvalidExternalUserTokenError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserAlread... Remove this comment to see the full error message
  UserAlreadyExistsWithAuthenticationMethodError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../models/AuthenticationMethod');

async function authenticateExternalUser({
  username,
  password,
  externalUserToken,
  expectedUserId,
  tokenService,
  authenticationService,
  obfuscationService,
  authenticationMethodRepository,
  userRepository
}: any) {
  try {
    const userFromCredentials = await authenticationService.getUserByUsernameAndPassword({
      username,
      password,
      userRepository,
    });

    if (userFromCredentials.id !== expectedUserId) {
      const expectedUser = await userRepository.getForObfuscation(expectedUserId);
      const authenticationMethod = await obfuscationService.getUserAuthenticationMethodWithObfuscation(expectedUser);

      throw new UnexpectedUserAccountError({
        message: undefined,
        code: 'UNEXPECTED_USER_ACCOUNT',
        meta: { value: authenticationMethod.value },
      });
    }

    await _addGarAuthenticationMethod({
      userId: userFromCredentials.id,
      externalUserToken,
      tokenService,
      authenticationMethodRepository,
      userRepository,
    });

    if (userFromCredentials.shouldChangePassword) {
      throw new UserShouldChangePasswordError();
    }

    const token = tokenService.createAccessTokenForSaml(userFromCredentials.id);
    await userRepository.updateLastLoggedAt({ userId: userFromCredentials.id });
    return token;
  } catch (error) {
    if (error instanceof UserNotFoundError || error instanceof PasswordNotMatching) {
      throw new MissingOrInvalidCredentialsError();
    } else {
      throw error;
    }
  }
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _addGarAuthenticationMethod({
  userId,
  externalUserToken,
  tokenService,
  authenticationMethodRepository,
  userRepository
}: any) {
  const samlId = tokenService.extractSamlId(externalUserToken);
  if (!samlId) {
    throw new InvalidExternalUserTokenError(
      'Une erreur est survenue. Veuillez réessayer de vous connecter depuis le médiacentre.'
    );
  }

  await _checkIfSamlIdIsNotReconciledWithAnotherUser({ samlId, userId, userRepository });

  const garAuthenticationMethod = new AuthenticationMethod({
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
    identityProvider: AuthenticationMethod.identityProviders.GAR,
    externalIdentifier: samlId,
    userId,
  });
  await authenticationMethodRepository.create({ authenticationMethod: garAuthenticationMethod });
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
const _checkIfSamlIdIsNotReconciledWithAnotherUser = async ({
  samlId,
  userId,
  userRepository
}: any) => {
  const userFromCredentialsBySamlId = await userRepository.getBySamlId(samlId);
  if (userFromCredentialsBySamlId && userFromCredentialsBySamlId.id !== userId) {
    throw new UserAlreadyExistsWithAuthenticationMethodError();
  }
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = authenticateExternalUser;
