// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCandidateAlreadyLinkedToUserError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function importCertificationCandidatesFromCandidatesImportSheet({
  sessionId,
  odsBuffer,
  certificationCandidatesOdsService,
  certificationCandidateRepository,
  certificationCpfService,
  certificationCpfCountryRepository,
  certificationCpfCityRepository,
  complementaryCertificationRepository,
  certificationCenterRepository,
  sessionRepository
}: any) {
  const linkedCandidateInSessionExists =
    await certificationCandidateRepository.doesLinkedCertificationCandidateInSessionExist({ sessionId });

  if (linkedCandidateInSessionExists) {
    throw new CertificationCandidateAlreadyLinkedToUserError('At least one candidate is already linked to a user');
  }

  const isSco = await sessionRepository.isSco({ sessionId });

  const certificationCandidates =
    await certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet({
      sessionId,
      isSco,
      odsBuffer,
      certificationCpfService,
      certificationCpfCountryRepository,
      certificationCpfCityRepository,
      complementaryCertificationRepository,
      certificationCenterRepository,
    });

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  await DomainTransaction.execute(async (domainTransaction: any) => {
    await certificationCandidateRepository.deleteBySessionId({ sessionId, domainTransaction });
    await bluebird.mapSeries(certificationCandidates, function (certificationCandidate: any) {
      return certificationCandidateRepository.saveInSession({
        certificationCandidate,
        complementaryCertifications: certificationCandidate.complementaryCertifications,
        sessionId,
        domainTransaction,
      });
    });
  });
};
