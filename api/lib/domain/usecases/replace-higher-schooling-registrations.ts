// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function replaceHigherSchoolingRegistrations({
  organizationId,
  higherSchoolingRegistrationRepository,
  higherSchoolingRegistrationParser
}: any) {
  const { registrations, warnings } = higherSchoolingRegistrationParser.parse();

  await higherSchoolingRegistrationRepository.replaceStudents(organizationId, registrations);

  return warnings;
};
