const {
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
} = require('./Badge').keys;

class PixEduBadgeAcquisitionOrderer {
  constructor({ badgesAcquisitions } = {}) {
    this.badgesAcquisitions = badgesAcquisitions;
  }

  getHighestBadge() {
    const formateurFormationContinueBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT
    );
    const expertFormationContinueBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE
    );
    const avanceFormationContinueBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME
    );
    const avanceFormationInitialeBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME
    );
    const autonomeFormationInitialeBadgeAcquisition = this.badgesAcquisitions.find(
      (badgesAcquisition) => badgesAcquisition.badgeKey === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE
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

module.exports = PixEduBadgeAcquisitionOrderer;
