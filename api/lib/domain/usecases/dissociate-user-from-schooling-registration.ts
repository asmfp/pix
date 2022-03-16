// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
const { SchoolingRegistrationCannotBeDissociatedError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function dissociateUserFromSchoolingRegistration({
  schoolingRegistrationId,
  schoolingRegistrationRepository
}: any) {
  const schoolingRegistrationForAdmin = await schoolingRegistrationRepository.getSchoolingRegistrationForAdmin(
    schoolingRegistrationId
  );
  if (!schoolingRegistrationForAdmin.canBeDissociated) {
    throw new SchoolingRegistrationCannotBeDissociatedError();
  }

  await schoolingRegistrationRepository.dissociateUserFromSchoolingRegistration(schoolingRegistrationId);
};
