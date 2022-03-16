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
} = require('../../domain/models/Badge').keys;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedB... Remove this comment to see the full error message
class CertifiedBadgeImage {
  isTemporaryBadge: any;
  levelName: any;
  path: any;
  constructor({
    path,
    isTemporaryBadge,
    levelName
  }: any) {
    this.path = path;
    this.isTemporaryBadge = isTemporaryBadge;
    this.levelName = levelName;
  }

  static finalFromPath(path: any) {
    return new CertifiedBadgeImage({
      path,
      isTemporaryBadge: false,
    });
  }

  // @ts-expect-error ts-migrate(7030) FIXME: Not all code paths return a value.
  static fromPartnerKey(partnerKey: any, temporaryPartnerKey: any) {
    const badgeKey = partnerKey || temporaryPartnerKey;
    const isTemporaryBadge = !partnerKey;

    if (badgeKey === PIX_DROIT_MAITRE_CERTIF) {
      return CertifiedBadgeImage.finalFromPath('https://images.pix.fr/badges-certifies/pix-droit/maitre.svg');
    }

    if (badgeKey === PIX_DROIT_EXPERT_CERTIF) {
      return CertifiedBadgeImage.finalFromPath('https://images.pix.fr/badges-certifies/pix-droit/expert.svg');
    }

    if (badgeKey === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE) {
      return new CertifiedBadgeImage({
        path: 'https://images.pix.fr/badges/Pix_plus_Edu-1-Initie-certif.svg',
        isTemporaryBadge,
        levelName: 'Initié (entrée dans le métier)',
      });
    }

    if (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
      [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME, PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME].includes(badgeKey)
    ) {
      return new CertifiedBadgeImage({
        path: 'https://images.pix.fr/badges/Pix_plus_Edu-2-Confirme-certif.svg',
        isTemporaryBadge,
        levelName: 'Confirmé',
      });
    }

    if (badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE) {
      return new CertifiedBadgeImage({
        path: 'https://images.pix.fr/badges/Pix_plus_Edu-3-Avance-certif.svg',
        isTemporaryBadge,
        levelName: 'Avancé',
      });
    }

    if (badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT) {
      return new CertifiedBadgeImage({
        path: 'https://images.pix.fr/badges/Pix_plus_Edu-4-Expert-certif.svg',
        isTemporaryBadge,
        levelName: 'Expert',
      });
    }
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertifiedBadgeImage;
