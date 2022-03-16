// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../models/CampaignParticipationStatuses');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipationCompetenceResult = require('./CampaignAssessmentParticipationCompetenceResult');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
class CampaignAssessmentParticipationResult {
  campaignId: any;
  campaignParticipationId: any;
  competenceResults: any;
  isShared: any;
  constructor({
    campaignParticipationId,
    campaignId,
    status,
    targetedCompetences,
    targetProfile,
    validatedTargetedKnowledgeElementsCountByCompetenceId = {}
  }: any) {
    this.campaignParticipationId = campaignParticipationId;
    this.campaignId = campaignId;
    this.isShared = status === SHARED;

    if (status !== SHARED) {
      this.competenceResults = [];
    } else {
      this.competenceResults = targetedCompetences.map((targetedCompetence: any) => {
        const targetedArea = targetProfile.getAreaOfCompetence(targetedCompetence.id);
        return new CampaignAssessmentParticipationCompetenceResult({
          campaignParticipationId,
          targetedArea,
          targetedCompetence,
          targetedSkillsCount: targetedCompetence.skillCount,
          validatedTargetedKnowledgeElementsCount:
            validatedTargetedKnowledgeElementsCountByCompetenceId[targetedCompetence.id],
        });
      });
    }
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignAssessmentParticipationResult;
