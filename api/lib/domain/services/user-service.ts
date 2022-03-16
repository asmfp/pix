// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../domain/models/AuthenticationMethod');

function _buildPasswordAuthenticationMethod({
  userId,
  hashedPassword
}: any) {
  return new AuthenticationMethod({
    userId,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
    identityProvider: AuthenticationMethod.identityProviders.PIX,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PixAuthenticationComplement' does not ex... Remove this comment to see the full error message
    authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
      password: hashedPassword,
      shouldChangePassword: false,
    }),
  });
}

function _buildGARAuthenticationMethod({
  externalIdentifier,
  userId
}: any) {
  return new AuthenticationMethod({
    externalIdentifier,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
    identityProvider: AuthenticationMethod.identityProviders.GAR,
    userId,
    authenticationComplement: null,
  });
}

async function createUserWithPassword({
  user,
  hashedPassword,
  userRepository,
  authenticationMethodRepository
}: any) {
  let savedUser;

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  await DomainTransaction.execute(async (domainTransaction: any) => {
    savedUser = await userRepository.create({ user, domainTransaction });

    const authenticationMethod = _buildPasswordAuthenticationMethod({
      userId: savedUser.id,
      hashedPassword,
    });

    await authenticationMethodRepository.create({
      authenticationMethod,
      domainTransaction,
    });
  });

  return savedUser;
}

async function updateUsernameAndAddPassword({
  userId,
  username,
  hashedPassword,
  authenticationMethodRepository,
  userRepository
}: any) {
  return DomainTransaction.execute(async (domainTransaction: any) => {
    await userRepository.updateUsername({ id: userId, username, domainTransaction });
    return authenticationMethodRepository.createPasswordThatShouldBeChanged({
      userId,
      hashedPassword,
      domainTransaction,
    });
  });
}

async function createAndReconcileUserToSchoolingRegistration({
  hashedPassword,
  samlId,
  schoolingRegistrationId,
  user,
  authenticationMethodRepository,
  schoolingRegistrationRepository,
  userRepository
}: any) {
  return DomainTransaction.execute(async (domainTransaction: any) => {
    let authenticationMethod;

    const createdUser = await userRepository.create({
      user,
      domainTransaction,
    });

    if (samlId) {
      authenticationMethod = _buildGARAuthenticationMethod({
        externalIdentifier: samlId,
        userId: createdUser.id,
      });
    } else {
      authenticationMethod = _buildPasswordAuthenticationMethod({
        hashedPassword,
        userId: createdUser.id,
      });
    }

    await authenticationMethodRepository.create({
      authenticationMethod,
      domainTransaction,
    });

    await schoolingRegistrationRepository.updateUserIdWhereNull({
      schoolingRegistrationId,
      userId: createdUser.id,
      domainTransaction,
    });

    return createdUser.id;
  });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  createAndReconcileUserToSchoolingRegistration,
  createUserWithPassword,
  updateUsernameAndAddPassword,
};
