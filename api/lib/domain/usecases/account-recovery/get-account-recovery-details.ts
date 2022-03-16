// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getAccountRecoveryDetails({
  temporaryKey,
  accountRecoveryDemandRepository,
  schoolingRegistrationRepository,
  userRepository,
  scoAccountRecoveryService
}: any) {
  const { id, newEmail, schoolingRegistrationId } =
    await scoAccountRecoveryService.retrieveAndValidateAccountRecoveryDemand({
      temporaryKey,
      accountRecoveryDemandRepository,
      userRepository,
    });

  const { firstName } = await schoolingRegistrationRepository.get(schoolingRegistrationId);

  return {
    id,
    email: newEmail,
    firstName,
  };
};
