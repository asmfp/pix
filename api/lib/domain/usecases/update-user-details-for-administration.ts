// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const has = require('lodash/has');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailAndUsernameError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredUsernameError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateUserDetailsForAdministration({
  userId,
  userDetailsForAdministration,
  userRepository
}: any) {
  const { email, username } = userDetailsForAdministration;

  const foundUsersWithEmailAlreadyUsed = email && (await userRepository.findAnotherUserByEmail(userId, email));
  const foundUsersWithUsernameAlreadyUsed =
    username && (await userRepository.findAnotherUserByUsername(userId, username));

  await _checkEmailAndUsernameAreAvailable({
    usersWithEmail: foundUsersWithEmailAlreadyUsed,
    usersWithUsername: foundUsersWithUsernameAlreadyUsed,
  });

  const userMustValidateTermsOfService = await _isAddingEmailForFirstTime({ userId, email, userRepository });
  if (userMustValidateTermsOfService) {
    userDetailsForAdministration.mustValidateTermsOfService = true;
  }

  await userRepository.updateUserDetailsForAdministration(userId, userDetailsForAdministration);

  return userRepository.getUserDetailsForAdmin(userId);
};

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _checkEmailAndUsernameAreAvailable({
  usersWithEmail,
  usersWithUsername
}: any) {
  const isEmailAlreadyUsed = has(usersWithEmail, '[0].email');
  const isUsernameAlreadyUsed = has(usersWithUsername, '[0].username');

  if (isEmailAlreadyUsed && isUsernameAlreadyUsed) {
    throw new AlreadyRegisteredEmailAndUsernameError();
  } else if (isEmailAlreadyUsed) {
    throw new AlreadyRegisteredEmailError();
  } else if (isUsernameAlreadyUsed) {
    throw new AlreadyRegisteredUsernameError();
  }
}

async function _isAddingEmailForFirstTime({
  userId,
  email,
  userRepository
}: any) {
  const user = await userRepository.get(userId);
  const userWithoutEmail = !user.email;
  const userHasUsername = !!user.username;
  const shouldChangeEmail = !!email;
  return userWithoutEmail && userHasUsername && shouldChangeEmail;
}
