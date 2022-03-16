const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AccountRec... Remove this comment to see the full error message
  AccountRecoveryDemandExpired,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MultipleSc... Remove this comment to see the full error message
  MultipleSchoolingRegistrationsWithDifferentNationalStudentIdError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserHasAlr... Remove this comment to see the full error message
  UserHasAlreadyLeftSCO,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

async function retrieveSchoolingRegistration({
  accountRecoveryDemandRepository,
  studentInformation,
  schoolingRegistrationRepository,
  userRepository,
  userReconciliationService
}: any) {
  const latestSchoolingRegistration = await schoolingRegistrationRepository.getLatestSchoolingRegistration({
    birthdate: studentInformation.birthdate,
    nationalStudentId: studentInformation.ineIna.toUpperCase(),
  });

  const userId = await _getUserIdByMatchingStudentInformationWithSchoolingRegistration({
    studentInformation,
    latestSchoolingRegistration,
    userReconciliationService,
  });

  const accountRecoveryDemands = await accountRecoveryDemandRepository.findByUserId(userId);

  if (accountRecoveryDemands.some((accountRecoveryDemand: any) => accountRecoveryDemand.used)) {
    throw new UserHasAlreadyLeftSCO();
  }

  await _checkIfThereAreMultipleUserForTheSameAccount({ userId, schoolingRegistrationRepository });

  const { username, email } = await userRepository.get(userId);

  const { id, firstName, lastName, organizationId } = latestSchoolingRegistration;

  return { id, userId, firstName, lastName, username, organizationId, email };
}

async function retrieveAndValidateAccountRecoveryDemand({
  temporaryKey,
  userRepository,
  accountRecoveryDemandRepository
}: any) {
  const { id, userId, newEmail, schoolingRegistrationId, createdAt } =
    await accountRecoveryDemandRepository.findByTemporaryKey(temporaryKey);
  await userRepository.checkIfEmailIsAvailable(newEmail);

  const accountRecoveryDemands = await accountRecoveryDemandRepository.findByUserId(userId);

  if (accountRecoveryDemands.some((accountRecoveryDemand: any) => accountRecoveryDemand.used)) {
    throw new UserHasAlreadyLeftSCO();
  }

  if (_demandHasExpired(createdAt)) {
    throw new AccountRecoveryDemandExpired();
  }

  return { id, userId, newEmail, schoolingRegistrationId };
}

function _demandHasExpired(demandCreationDate: any) {
  const minutesInADay = 60 * 24;
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
  const lifetimeInMinutes = parseInt(process.env.SCO_ACCOUNT_RECOVERY_KEY_LIFETIME_MINUTES) || minutesInADay;
  const millisecondsInAMinute = 60 * 1000;
  const lifetimeInMilliseconds = lifetimeInMinutes * millisecondsInAMinute;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  const expirationDate = new Date(demandCreationDate.getTime() + lifetimeInMilliseconds);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  const now = new Date();

  return expirationDate < now;
}

async function _getUserIdByMatchingStudentInformationWithSchoolingRegistration({
  studentInformation,
  latestSchoolingRegistration,
  userReconciliationService
}: any) {
  const matchingSchoolingRegistrationId = await userReconciliationService.findMatchingCandidateIdForGivenUser(
    [latestSchoolingRegistration],
    { firstName: studentInformation.firstName, lastName: studentInformation.lastName }
  );

  if (!matchingSchoolingRegistrationId) {
    throw new UserNotFoundError();
  }

  return latestSchoolingRegistration.userId;
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _checkIfThereAreMultipleUserForTheSameAccount({
  userId,
  schoolingRegistrationRepository
}: any) {
  const schoolingRegistrations = await schoolingRegistrationRepository.findByUserId({ userId });

  if (_.uniqBy(schoolingRegistrations, 'nationalStudentId').length > 1) {
    throw new MultipleSchoolingRegistrationsWithDifferentNationalStudentIdError();
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  retrieveSchoolingRegistration,
  retrieveAndValidateAccountRecoveryDemand,
};
