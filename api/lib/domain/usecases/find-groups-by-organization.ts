// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findGroupByOrganization({
  organizationId,
  groupRepository
}: any) {
  return groupRepository.findByOrganizationId({ organizationId });
};
