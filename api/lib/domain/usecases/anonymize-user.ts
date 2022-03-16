// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function anonymizeUser({
  userId,
  userRepository,
  authenticationMethodRepository
}: any) {
  const anonymizedUser = {
    firstName: `prenom_${userId}`,
    lastName: `nom_${userId}`,
    email: `email_${userId}@example.net`,
    // @ts-expect-error ts-migrate(7018) FIXME: Object literal's property 'username' implicitly ha... Remove this comment to see the full error message
    username: null,
  };

  await authenticationMethodRepository.removeAllAuthenticationMethodsByUserId({ userId });
  return userRepository.updateUserDetailsForAdministration(userId, anonymizedUser);
};
