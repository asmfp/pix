// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateStudentNumber({
  schoolingRegistrationId,
  studentNumber,
  organizationId,
  higherSchoolingRegistrationRepository
}: any) {
  const registration = await higherSchoolingRegistrationRepository.findOneByStudentNumber({
    organizationId,
    studentNumber,
  });

  if (registration) {
    throw new AlreadyExistingEntityError('STUDENT_NUMBER_EXISTS');
  }

  await higherSchoolingRegistrationRepository.updateStudentNumber(schoolingRegistrationId, studentNumber);
};
