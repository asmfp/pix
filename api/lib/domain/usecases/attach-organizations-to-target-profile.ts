// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationsToAttachToTargetProfile } = require('../models');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function attachOrganizationsToTargetProfile({
  targetProfileId,
  organizationIds,
  organizationsToAttachToTargetProfileRepository
}: any) {
  const targetProfileOrganizations = new OrganizationsToAttachToTargetProfile({ id: targetProfileId });

  targetProfileOrganizations.attach(organizationIds);

  return organizationsToAttachToTargetProfileRepository.attachOrganizations(targetProfileOrganizations);
};
