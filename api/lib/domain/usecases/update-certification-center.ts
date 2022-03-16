// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterCreationValidator = require('../validators/certification-center-creation-validator');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationHabilitation = require('../../domain/models/ComplementaryCertificationHabilitation');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateCertificationCenter({
  certificationCenter,
  complementaryCertificationIds,
  certificationCenterRepository,
  complementaryCertificationHabilitationRepository
}: any) {
  certificationCenterCreationValidator.validate(certificationCenter);
  if (certificationCenter.id) {
    await complementaryCertificationHabilitationRepository.deleteByCertificationCenterId(certificationCenter.id);
  }
  if (complementaryCertificationIds) {
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
    await Promise.all(
      complementaryCertificationIds.map((complementaryCertificationId: any) => {
        const complementaryCertificationHabilitation = new ComplementaryCertificationHabilitation({
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
          complementaryCertificationId: parseInt(complementaryCertificationId),
          certificationCenterId: certificationCenter.id,
        });
        return complementaryCertificationHabilitationRepository.save(complementaryCertificationHabilitation);
      })
    );
  }

  return certificationCenterRepository.save(certificationCenter);
};
