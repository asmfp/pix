// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'StudentInf... Remove this comment to see the full error message
const StudentInformationForAccountRecovery = require('../read-models/StudentInformationForAccountRecovery');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function checkScoAccountRecovery({
  studentInformation,
  schoolingRegistrationRepository,
  organizationRepository,
  accountRecoveryDemandRepository,
  userRepository,
  scoAccountRecoveryService,
  userReconciliationService
}: any) {
  const { firstName, lastName, username, organizationId, email } =
    await scoAccountRecoveryService.retrieveSchoolingRegistration({
      studentInformation,
      accountRecoveryDemandRepository,
      schoolingRegistrationRepository,
      userRepository,
      userReconciliationService,
    });

  const { name: latestOrganizationName } = await organizationRepository.get(organizationId);

  return new StudentInformationForAccountRecovery({
    firstName,
    lastName,
    username,
    email,
    latestOrganizationName,
  });
};
