// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getShareableCertificate({
  verificationCode,
  shareableCertificateRepository
}: any) {
  const shareableCertificate = await shareableCertificateRepository.getByVerificationCode(verificationCode);

  return shareableCertificate;
};
