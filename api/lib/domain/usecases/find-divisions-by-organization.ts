// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findDivisionsByOrganization({
  organizationId,
  divisionRepository
}: any) {
  const divisionsOrderedByPostgres = await divisionRepository.findByOrganizationIdForCurrentSchoolYear({
    organizationId,
  });
  const divisionsOrderedByName = divisionsOrderedByPostgres.sort((divisionA: any, divisionB: any) =>
    divisionA.name.localeCompare(divisionB.name, 'fr')
  );
  return divisionsOrderedByName;
};
