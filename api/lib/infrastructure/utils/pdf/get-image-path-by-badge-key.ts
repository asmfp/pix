const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V2,
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
} = require('../../../domain/models/Badge').keys;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
const macaronCleaPath = `${__dirname}/files/macaron_clea.png`;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
const macaronPixPlusDroitMaitrePath = `${__dirname}/files/macaron_maitre.png`;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
const macaronPixPlusDroitExpertPath = `${__dirname}/files/macaron_expert.png`;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
const macaronPixPlusEduInitiePath = `${__dirname}/files/macaron_edu_initie.png`;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
const macaronPixPlusEduConfirmePath = `${__dirname}/files/macaron_edu_confirme.png`;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
const macaronPixPlusEduAvancePath = `${__dirname}/files/macaron_edu_avance.png`;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
const macaronPixPlusEduExpertPath = `${__dirname}/files/macaron_edu_expert.png`;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function getImagePathByBadgeKey(badgeKey: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
  if ([PIX_EMPLOI_CLEA, PIX_EMPLOI_CLEA_V2].includes(badgeKey)) {
    return macaronCleaPath;
  }
  if (badgeKey === PIX_DROIT_MAITRE_CERTIF) {
    return macaronPixPlusDroitMaitrePath;
  }
  if (badgeKey === PIX_DROIT_EXPERT_CERTIF) {
    return macaronPixPlusDroitExpertPath;
  }
  if (badgeKey === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE) {
    return macaronPixPlusEduInitiePath;
  }
  if (
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
    [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME, PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME].includes(badgeKey)
  ) {
    return macaronPixPlusEduConfirmePath;
  }
  if (badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE) {
    return macaronPixPlusEduAvancePath;
  }
  if (badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT) {
    return macaronPixPlusEduExpertPath;
  }
};
