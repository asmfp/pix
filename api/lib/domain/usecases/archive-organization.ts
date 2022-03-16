// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationToArchive = require('../models/OrganizationToArchive');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function archiveOrganization({
  organizationId,
  userId,
  organizationToArchiveRepository,
  organizationForAdminRepository
}: any) {
  const organizationToArchive = new OrganizationToArchive({ id: organizationId });
  organizationToArchive.archive({ archivedBy: userId });
  await organizationToArchiveRepository.save(organizationToArchive);

  return await organizationForAdminRepository.get(organizationId);
};
