// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'crypto'.
const crypto = require('crypto');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AccountRec... Remove this comment to see the full error message
const AccountRecoveryDemand = require('../../models/AccountRecoveryDemand');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function sendEmailForAccountRecovery({
  studentInformation,
  temporaryKey,
  schoolingRegistrationRepository,
  userRepository,
  accountRecoveryDemandRepository,
  mailService,
  scoAccountRecoveryService,
  userReconciliationService
}: any) {
  const { email: newEmail } = studentInformation;
  const encodedTemporaryKey = temporaryKey || crypto.randomBytes(32).toString('hex');

  const {
    firstName,
    id,
    userId,
    email: oldEmail,
  } = await scoAccountRecoveryService.retrieveSchoolingRegistration({
    studentInformation,
    accountRecoveryDemandRepository,
    schoolingRegistrationRepository,
    userRepository,
    userReconciliationService,
  });

  await userRepository.checkIfEmailIsAvailable(newEmail);

  const accountRecoveryDemand = new AccountRecoveryDemand({
    userId,
    schoolingRegistrationId: id,
    newEmail,
    oldEmail,
    used: false,
    temporaryKey: encodedTemporaryKey,
  });
  await accountRecoveryDemandRepository.save(accountRecoveryDemand);

  await mailService.sendAccountRecoveryEmail({
    firstName,
    email: newEmail,
    temporaryKey: encodedTemporaryKey,
  });
};
