const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToUpdateEmailError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidVer... Remove this comment to see the full error message
  InvalidVerificationCodeError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EmailModif... Remove this comment to see the full error message
  EmailModificationDemandNotFoundOrExpiredError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateUserEmailWithValidation({
  code,
  userId,
  userEmailRepository,
  userRepository
}: any) {
  const user = await userRepository.get(userId);
  if (!user.email) {
    throw new UserNotAuthorizedToUpdateEmailError();
  }

  const emailModificationDemand = await userEmailRepository.getEmailModificationDemandByUserId(userId);
  if (!emailModificationDemand) {
    throw new EmailModificationDemandNotFoundOrExpiredError();
  }

  if (code !== emailModificationDemand.code) {
    throw new InvalidVerificationCodeError();
  }

  await userRepository.checkIfEmailIsAvailable(emailModificationDemand.newEmail);

  await userRepository.updateWithEmailConfirmed({
    id: userId,
    userAttributes: {
      email: emailModificationDemand.newEmail,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      emailConfirmedAt: new Date(),
    },
  });

  return { email: emailModificationDemand.newEmail };
};
