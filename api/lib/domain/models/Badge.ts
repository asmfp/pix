// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Badge'.
class Badge {
  altMessage: any;
  badgeCriteria: any;
  id: any;
  imageUrl: any;
  isAlwaysVisible: any;
  isCertifiable: any;
  key: any;
  message: any;
  skillSets: any;
  targetProfileId: any;
  title: any;
  constructor({
    id,
    key,
    altMessage,
    imageUrl,
    message,
    title,
    isCertifiable,
    badgeCriteria = [],
    skillSets = [],
    targetProfileId,
    isAlwaysVisible = false
  }: any = {}) {
    this.id = id;
    this.altMessage = altMessage;
    this.imageUrl = imageUrl;
    this.message = message;
    this.title = title;
    this.key = key;
    this.isCertifiable = isCertifiable;
    this.badgeCriteria = badgeCriteria;
    this.skillSets = skillSets;
    this.targetProfileId = targetProfileId;
    this.isAlwaysVisible = isAlwaysVisible;
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'keys' does not exist on type 'typeof Bad... Remove this comment to see the full error message
Badge.keys = {
  PIX_EMPLOI_CLEA: 'PIX_EMPLOI_CLEA',
  PIX_EMPLOI_CLEA_V2: 'PIX_EMPLOI_CLEA_V2',
  PIX_DROIT_MAITRE_CERTIF: 'PIX_DROIT_MAITRE_CERTIF',
  PIX_DROIT_EXPERT_CERTIF: 'PIX_DROIT_EXPERT_CERTIF',
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE: 'PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE',
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME: 'PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME',
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME: 'PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME',
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE: 'PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE',
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT: 'PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT',
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Badge;
