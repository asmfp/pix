// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
const { CampaignCodeError, SchoolingRegistrationAlreadyLinkedToUserError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'STUDENT_RE... Remove this comment to see the full error message
const { STUDENT_RECONCILIATION_ERRORS } = require('../constants');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function reconcileSchoolingRegistration({
  campaignCode,
  reconciliationInfo,
  withReconciliation,
  campaignRepository,
  schoolingRegistrationRepository,
  studentRepository,
  userRepository,
  obfuscationService,
  userReconciliationService
}: any) {
  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    throw new CampaignCodeError();
  }

  const matchedSchoolingRegistration =
    await userReconciliationService.findMatchingSchoolingRegistrationIdForGivenOrganizationIdAndUser({
      organizationId: campaign.organizationId,
      reconciliationInfo,
      schoolingRegistrationRepository,
    });

  await userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount(
    matchedSchoolingRegistration,
    userRepository,
    obfuscationService,
    studentRepository
  );

  await _checkIfAnotherStudentIsAlreadyReconciledWithTheSameOrganizationAndUser(
    reconciliationInfo.id,
    campaign.organizationId,
    schoolingRegistrationRepository
  );

  if (withReconciliation) {
    return schoolingRegistrationRepository.reconcileUserToSchoolingRegistration({
      userId: reconciliationInfo.id,
      schoolingRegistrationId: matchedSchoolingRegistration.id,
    });
  }
};

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _checkIfAnotherStudentIsAlreadyReconciledWithTheSameOrganizationAndUser(
  userId: any,
  organizationId: any,
  schoolingRegistrationRepository: any
) {
  const schoolingRegistrationFound = await schoolingRegistrationRepository.findOneByUserIdAndOrganizationId({
    userId,
    organizationId,
  });

  if (schoolingRegistrationFound) {
    const detail = 'Un autre étudiant est déjà réconcilié dans la même organisation et avec le même compte utilisateur';
    const error = STUDENT_RECONCILIATION_ERRORS.RECONCILIATION.IN_SAME_ORGANIZATION.anotherStudentIsAlreadyReconciled;
    const meta = {
      shortCode: error.shortCode,
    };
    throw new SchoolingRegistrationAlreadyLinkedToUserError(detail, error.code, meta);
  }
}
