// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getPrivateCertificate({
  certificationId,
  userId,
  privateCertificateRepository
}: any) {
  const privateCertificate = await privateCertificateRepository.get(certificationId);
  if (privateCertificate.userId !== userId) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 0.
    throw new NotFoundError();
  }

  return privateCertificate;
};
