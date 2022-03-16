const {
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
} = require('./Badge').keys;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PixEduBadg... Remove this comment to see the full error message
class PixEduBadgeAcquisitionOrderer {
  badgesAcquisitions: any;
  constructor({
    badgesAcquisitions
  }: any = {}) {
    this.badgesAcquisitions = badgesAcquisitions;
  }

  getHighestBadge() {
    const formateurFormationContinueBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition: any) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT
    );
    const expertFormationContinueBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition: any) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE
    );
    const avanceFormationContinueBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition: any) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME
    );
    const avanceFormationInitialeBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition: any) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME
    );
    const autonomeFormationInitialeBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition: any) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE
    );
    return (
      formateurFormationContinueBadgeAcquisition ||
      expertFormationContinueBadgeAcquisition ||
      avanceFormationContinueBadgeAcquisition ||
      avanceFormationInitialeBadgeAcquisition ||
      autonomeFormationInitialeBadgeAcquisition
    );
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PixEduBadgeAcquisitionOrderer;
