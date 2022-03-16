// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getUserByResetPasswordDemand({
  temporaryKey,
  resetPasswordService,
  tokenService,
  userRepository
}: any) {
  await tokenService.decodeIfValid(temporaryKey);
  const { email } = await resetPasswordService.verifyDemand(temporaryKey);
  return userRepository.getByEmail(email);
};
