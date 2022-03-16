// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'get'.
const get = require('lodash/get');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateExpiredPassword({
  expiredPassword,
  newPassword,
  username,
  authenticationService,
  encryptionService,
  authenticationMethodRepository,
  userRepository
}: any) {
  const foundUser = await authenticationService.getUserByUsernameAndPassword({
    username,
    password: expiredPassword,
    userRepository,
  });

  const shouldChangePassword = get(foundUser, 'authenticationMethods[0].authenticationComplement.shouldChangePassword');

  if (!shouldChangePassword) {
    throw new ForbiddenAccess();
  }

  const hashedPassword = await encryptionService.hashPassword(newPassword);

  return authenticationMethodRepository.updateExpiredPassword({
    userId: foundUser.id,
    hashedPassword,
  });
};
