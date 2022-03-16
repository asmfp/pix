// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function reconcileHigherSchoolingRegistration({
  campaignCode,
  reconciliationInfo: { userId, studentNumber, firstName, lastName, birthdate },
  campaignRepository,
  higherSchoolingRegistrationRepository,
  schoolingRegistrationRepository,
  userReconciliationService
}: any) {
  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 0.
    throw new NotFoundError();
  }

  const matchedSchoolingRegistration =
    await userReconciliationService.findMatchingHigherSchoolingRegistrationIdForGivenOrganizationIdAndUser({
      organizationId: campaign.organizationId,
      reconciliationInfo: { studentNumber, firstName, lastName, birthdate },
      higherSchoolingRegistrationRepository,
    });

  return schoolingRegistrationRepository.reconcileUserToSchoolingRegistration({
    userId,
    schoolingRegistrationId: matchedSchoolingRegistration.id,
  });
};
