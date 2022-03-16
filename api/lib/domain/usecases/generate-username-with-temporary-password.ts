// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isEmpty'.
const isEmpty = require('lodash/isEmpty');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToGenerateUsernamePasswordError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function generateUsernameWithTemporaryPassword({
  schoolingRegistrationId,
  organizationId,
  passwordGenerator,
  encryptionService,
  userReconciliationService,
  userService,
  authenticationMethodRepository,
  userRepository,
  schoolingRegistrationRepository
}: any) {
  const schoolingRegistration = await schoolingRegistrationRepository.get(schoolingRegistrationId);
  _checkIfStudentHasAccessToOrganization(schoolingRegistration, organizationId);

  const studentAccount = await userRepository.get(schoolingRegistration.userId);
  _checkIfStudentAccountAlreadyHasUsername(studentAccount);

  const username = await userReconciliationService.createUsernameByUser({
    user: schoolingRegistration,
    userRepository,
  });

  const hasStudentAccountAnIdentityProviderPIX = await authenticationMethodRepository.hasIdentityProviderPIX({
    userId: studentAccount.id,
  });

  if (hasStudentAccountAnIdentityProviderPIX) {
    const updatedUser = await userRepository.addUsername(studentAccount.id, username);
    return { username: updatedUser.username };
  } else {
    const generatedPassword = passwordGenerator.generateSimplePassword();
    const hashedPassword = await encryptionService.hashPassword(generatedPassword);

    // and Create Password
    await userService.updateUsernameAndAddPassword({
      userId: studentAccount.id,
      username,
      hashedPassword,
      authenticationMethodRepository,
      userRepository,
    });

    return { username, generatedPassword };
  }
};

function _checkIfStudentHasAccessToOrganization(schoolingRegistration: any, organizationId: any) {
  if (schoolingRegistration.organizationId !== organizationId) {
    throw new UserNotAuthorizedToGenerateUsernamePasswordError(
      `L'élève avec l'INE ${schoolingRegistration.nationalStudentId} n'appartient pas à l'organisation.`
    );
  }
}

function _checkIfStudentAccountAlreadyHasUsername(studentAccount: any) {
  if (!isEmpty(studentAccount.username)) {
    throw new UserNotAuthorizedToGenerateUsernamePasswordError(
      `Ce compte utilisateur dispose déjà d'un identifiant: ${studentAccount.username}.`
    );
  }
}
