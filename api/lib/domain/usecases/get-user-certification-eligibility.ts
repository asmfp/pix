// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationEligibility = require('../read-models/CertificationEligibility');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../models/Badge').keys;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getUserCertificationEligibility({
  userId,
  placementProfileService,
  certificationBadgesService
}: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  const now = new Date();
  const placementProfile = await placementProfileService.getPlacementProfile({ userId, limitDate: now });
  const pixCertificationEligible = placementProfile.isCertifiable();
  const cleaCertificationEligible = await _computeCleaCertificationEligibility({
    userId,
    pixCertificationEligible,
    certificationBadgesService,
  });
  const {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'pixPlusDroitMaitreCertificationEligible'... Remove this comment to see the full error message
    pixPlusDroitMaitreCertificationEligible,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'pixPlusDroitExpertCertificationEligible'... Remove this comment to see the full error message
    pixPlusDroitExpertCertificationEligible,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'pixPlusEduInitieCertificationEligible' d... Remove this comment to see the full error message
    pixPlusEduInitieCertificationEligible,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'pixPlusEduConfirmeCertificationEligible'... Remove this comment to see the full error message
    pixPlusEduConfirmeCertificationEligible,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'pixPlusEduAvanceCertificationEligible' d... Remove this comment to see the full error message
    pixPlusEduAvanceCertificationEligible,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'pixPlusEduExpertCertificationEligible' d... Remove this comment to see the full error message
    pixPlusEduExpertCertificationEligible,
  } = await _computePixPlusCertificationEligibility({
    userId,
    pixCertificationEligible,
    certificationBadgesService,
  });

  return new CertificationEligibility({
    id: userId,
    pixCertificationEligible,
    cleaCertificationEligible,
    pixPlusDroitMaitreCertificationEligible,
    pixPlusDroitExpertCertificationEligible,
    pixPlusEduInitieCertificationEligible,
    pixPlusEduConfirmeCertificationEligible,
    pixPlusEduAvanceCertificationEligible,
    pixPlusEduExpertCertificationEligible,
  });
};

async function _computeCleaCertificationEligibility({
  userId,
  pixCertificationEligible,
  certificationBadgesService
}: any) {
  if (!pixCertificationEligible) return false;
  return certificationBadgesService.hasStillValidCleaBadgeAcquisition({ userId });
}

async function _computePixPlusCertificationEligibility({
  userId,
  pixCertificationEligible,
  certificationBadgesService
}: any) {
  if (!pixCertificationEligible) {
    return {
      pixPlusDroitMaitreCertificationEligible: false,
      pixPlusDroitExpertCertificationEligible: false,
      pixPlusEduInitieCertificationEligible: false,
      pixPlusEduAvanceCertificationEligible: false,
      pixPlusEduConfirmeCertificationEligible: false,
      pixPlusEduExpertCertificationEligible: false,
    };
  }
  const stillValidCertifiableBadgeAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
    userId,
  });
  const pixPlusDroitMaitreBadgeAcquisition = _.find(stillValidCertifiableBadgeAcquisitions, {
    badgeKey: PIX_DROIT_MAITRE_CERTIF,
  });
  const pixPlusDroitExpertBadgeAcquisition = _.find(stillValidCertifiableBadgeAcquisitions, {
    badgeKey: PIX_DROIT_EXPERT_CERTIF,
  });
  const pixPlusEduInitieBadgeAcquisition = _.find(stillValidCertifiableBadgeAcquisitions, {
    badgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  });
  const pixPlusEduConfirmeBadgeAcquisition = _.find(stillValidCertifiableBadgeAcquisitions, (badgeAcquisition: any) => {
    return (
      badgeAcquisition.badgeKey === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME ||
      badgeAcquisition.badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME
    );
  });
  const pixPlusEduAvanceBadgeAcquisition = _.find(stillValidCertifiableBadgeAcquisitions, {
    badgeKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  });
  const pixPlusEduExpertBadgeAcquisition = _.find(stillValidCertifiableBadgeAcquisitions, {
    badgeKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  });

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
  const pixPlusDroitMaitreCertificationEligible = Boolean(pixPlusDroitMaitreBadgeAcquisition);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
  const pixPlusDroitExpertCertificationEligible = Boolean(pixPlusDroitExpertBadgeAcquisition);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
  const pixPlusEduInitieCertificationEligible = Boolean(pixPlusEduInitieBadgeAcquisition);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
  const pixPlusEduConfirmeCertificationEligible = Boolean(pixPlusEduConfirmeBadgeAcquisition);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
  const pixPlusEduAvanceCertificationEligible = Boolean(pixPlusEduAvanceBadgeAcquisition);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
  const pixPlusEduExpertCertificationEligible = Boolean(pixPlusEduExpertBadgeAcquisition);
  return {
    pixPlusDroitMaitreCertificationEligible,
    pixPlusDroitExpertCertificationEligible,
    pixPlusEduInitieCertificationEligible,
    pixPlusEduConfirmeCertificationEligible,
    pixPlusEduAvanceCertificationEligible,
    pixPlusEduExpertCertificationEligible,
  };
}
