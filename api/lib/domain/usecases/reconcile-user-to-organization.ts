// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
const { CampaignCodeError, UserCouldNotBeReconciledError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function reconcileUserToOrganization({
  campaignCode,
  userId,
  campaignRepository,
  schoolingRegistrationRepository
}: any) {
  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    throw new CampaignCodeError();
  }

  const studentSchoolingRegistrations = await schoolingRegistrationRepository.findByUserId({ userId });

  if (_.isEmpty(studentSchoolingRegistrations)) {
    throw new UserCouldNotBeReconciledError();
  }

  const nationalStudentIdForReconcile = _.orderBy(studentSchoolingRegistrations, 'updatedAt', 'desc')[0]
    .nationalStudentId;

  return schoolingRegistrationRepository.reconcileUserByNationalStudentIdAndOrganizationId({
    userId,
    nationalStudentId: nationalStudentIdForReconcile,
    organizationId: campaign.organizationId,
  });
};
