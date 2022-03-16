// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
class CampaignAssessmentParticipationCompetenceResult {
  areaColor: any;
  competenceMasteryRate: any;
  id: any;
  index: any;
  name: any;
  constructor({
    campaignParticipationId,
    targetedArea,
    targetedCompetence,
    targetedSkillsCount,
    validatedTargetedKnowledgeElementsCount
  }: any = {}) {
    this.id = `${campaignParticipationId}-${targetedCompetence.id}`;
    this.name = targetedCompetence.name;
    this.index = targetedCompetence.index;
    this.areaColor = targetedArea.color;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
    this.competenceMasteryRate = Number((validatedTargetedKnowledgeElementsCount / targetedSkillsCount).toFixed(2));
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignAssessmentParticipationCompetenceResult;
