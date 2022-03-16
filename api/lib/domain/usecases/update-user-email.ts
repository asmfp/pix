// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../models/AuthenticationMethod');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToUpdateEmailError, InvalidPasswordForUpdateEmailError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateUserEmail({
  email,
  userId,
  authenticatedUserId,
  password,
  locale,
  userRepository,
  authenticationMethodRepository,
  encryptionService,
  mailService
}: any) {
  if (userId !== authenticatedUserId) {
    throw new UserNotAuthorizedToUpdateEmailError();
  }

  const user = await userRepository.get(userId);
  if (!user.email) {
    throw new UserNotAuthorizedToUpdateEmailError();
  }

  const authenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
    userId,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
    identityProvider: AuthenticationMethod.identityProviders.PIX,
  });

  try {
    const passwordHash = authenticationMethod.authenticationComplement.password;

    await encryptionService.checkPassword({
      password,
      passwordHash,
    });
  } catch (e) {
    throw new InvalidPasswordForUpdateEmailError();
  }

  await userRepository.checkIfEmailIsAvailable(email);
  await userRepository.updateEmail({ id: userId, email: email.toLowerCase() });
  await mailService.notifyEmailChange({ email, locale });
};
