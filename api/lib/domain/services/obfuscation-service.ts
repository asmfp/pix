// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationMethodRepository = require('../../infrastructure/repositories/authentication-method-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../models/AuthenticationMethod');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../errors');

const CONNEXION_TYPES = {
  username: 'username',
  email: 'email',
  samlId: 'samlId',
};
const ASTERISK_OBFUSCATION = '***';
const USERNAME_SEPARATOR = '.';
const EMAIL_SEPARATOR = '@';

const TWO_PARTS = 2;

async function getUserAuthenticationMethodWithObfuscation(user: any) {
  const garAuthenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
    userId: user.id,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
    identityProvider: AuthenticationMethod.identityProviders.GAR,
  });
  if (garAuthenticationMethod) return { authenticatedBy: CONNEXION_TYPES.samlId, value: null };

  if (user.username) {
    const username = usernameObfuscation(user.username);
    return { authenticatedBy: CONNEXION_TYPES.username, value: username };
  }
  if (user.email) {
    const email = emailObfuscation(user.email);
    return { authenticatedBy: CONNEXION_TYPES.email, value: email };
  } else {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError("Aucune méthode d'authentification trouvée dont le fournisseur d'identité est GAR ou PIX.");
  }
}

function emailObfuscation(email: any) {
  const parts = _.split(email, EMAIL_SEPARATOR, TWO_PARTS);
  return `${_.first(email)}${ASTERISK_OBFUSCATION}${EMAIL_SEPARATOR}${_.last(parts)}`;
}

function usernameObfuscation(username: any) {
  const parts = _.split(username, USERNAME_SEPARATOR, TWO_PARTS);
  const name = _.last(parts);
  return `${_.first(username)}${ASTERISK_OBFUSCATION}${USERNAME_SEPARATOR}${_.first(
    name
  )}${ASTERISK_OBFUSCATION}${_.last(name)}`;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  usernameObfuscation,
  emailObfuscation,
  getUserAuthenticationMethodWithObfuscation,
};
