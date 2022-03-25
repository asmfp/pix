const DomainTransaction = require('../../infrastructure/DomainTransaction');

const AuthenticationMethod = require('../../domain/models/AuthenticationMethod');
const UserToCreate = require('../models/UserToCreate');

function _buildPasswordAuthenticationMethod({ userId, hashedPassword }) {
  return new AuthenticationMethod({
    userId,
    identityProvider: AuthenticationMethod.identityProviders.PIX,
    authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
      password: hashedPassword,
      shouldChangePassword: false,
    }),
  });
}

function _buildGARAuthenticationMethod({ externalIdentifier, user }) {
  return new AuthenticationMethod({
    externalIdentifier,
    identityProvider: AuthenticationMethod.identityProviders.GAR,
    userId: user.id,
    authenticationComplement: new AuthenticationMethod.GARAuthenticationComplement({
      firstName: user.firstName,
      lastName: user.lastName,
    }),
  });
}

async function createUserWithPassword({
  user,
  hashedPassword,
  userToCreateRepository,
  authenticationMethodRepository,
}) {
  let savedUser;
  const userToAdd = new UserToCreate(user);
  userToAdd.create();

  await DomainTransaction.execute(async (domainTransaction) => {
    savedUser = await userToCreateRepository.create({ user: userToAdd, domainTransaction });

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
  userRepository,
}) {
  return DomainTransaction.execute(async (domainTransaction) => {
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
  userToCreateRepository,
}) {
  const userToAdd = new UserToCreate(user);
  userToAdd.create();

  return DomainTransaction.execute(async (domainTransaction) => {
    let authenticationMethod;

    const createdUser = await userToCreateRepository.create({
      user: userToAdd,
      domainTransaction,
    });

    if (samlId) {
      authenticationMethod = _buildGARAuthenticationMethod({
        externalIdentifier: samlId,
        user: createdUser,
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

module.exports = {
  createAndReconcileUserToSchoolingRegistration,
  createUserWithPassword,
  updateUsernameAndAddPassword,
};
