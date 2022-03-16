// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function ({
  organizationId,
  TargetProfileForSpecifierRepository
}: any) {
  return TargetProfileForSpecifierRepository.availableForOrganization(organizationId);
};
