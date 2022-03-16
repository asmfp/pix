// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotMem... Remove this comment to see the full error message
const { UserNotMemberOfOrganizationError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

function _isCurrentOrganizationInMemberships(userOrgaSettings: any, memberships: any) {
  const currentOrganizationId = userOrgaSettings.currentOrganization.id;
  return _.find(memberships, { organization: { id: currentOrganizationId } });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getPrescriber({
  userId,
  prescriberRepository,
  membershipRepository,
  userOrgaSettingsRepository
}: any) {
  const memberships = await membershipRepository.findByUserId({ userId });
  if (_.isEmpty(memberships)) {
    throw new UserNotMemberOfOrganizationError(`L’utilisateur ${userId} n’est membre d’aucune organisation.`);
  }

  const userOrgaSettings = await userOrgaSettingsRepository.findOneByUserId(userId);
  const firstOrganization = memberships[0].organization;

  if (_.isEmpty(userOrgaSettings)) {
    await userOrgaSettingsRepository.create(userId, firstOrganization.id);
    return prescriberRepository.getPrescriber(userId);
  }

  if (!_isCurrentOrganizationInMemberships(userOrgaSettings, memberships)) {
    await userOrgaSettingsRepository.update(userId, firstOrganization.id);
  }

  return prescriberRepository.getPrescriber(userId);
};
