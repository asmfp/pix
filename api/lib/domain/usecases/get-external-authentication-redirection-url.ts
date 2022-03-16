// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getExternalAuthenticationRedirectionUrl({
  userAttributes,
  userRepository,
  tokenService,
  settings
}: any) {
  const { attributeMapping } = settings.saml;

  const externalUser = {
    firstName: userAttributes[attributeMapping.firstName],
    lastName: userAttributes[attributeMapping.lastName],
    samlId: userAttributes[attributeMapping.samlId],
  };

  const user = await userRepository.getBySamlId(externalUser.samlId);

  if (user) {
    const token = tokenService.createAccessTokenForSaml(user.id);
    await userRepository.updateLastLoggedAt({ userId: user.id });
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'encodeURIComponent'.
    return `/?token=${encodeURIComponent(token)}&user-id=${user.id}`;
  } else {
    const externalUserToken = tokenService.createIdTokenForUserReconciliation(externalUser);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'encodeURIComponent'.
    return `/campagnes?externalUser=${encodeURIComponent(externalUserToken)}`;
  }
};
