// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Progressio... Remove this comment to see the full error message
const Progression = require('../../../lib/domain/models/Progression');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getProgression({
  progressionId,
  userId,
  assessmentRepository,
  competenceEvaluationRepository,
  campaignParticipationRepository,
  knowledgeElementRepository,
  skillRepository,
  targetProfileRepository,
  improvementService
}: any) {
  const assessmentId = Progression.getAssessmentIdFromId(progressionId);

  const assessment = await assessmentRepository.getByAssessmentIdAndUserId(assessmentId, userId);
  let progression;

  if (assessment.isForCampaign()) {
    const campaignParticipation = await campaignParticipationRepository.get(assessment.campaignParticipationId);
    let targetProfile;
    if (!assessment.isFlash()) {
      targetProfile = await targetProfileRepository.getByCampaignId(campaignParticipation.campaignId);
    }
    const knowledgeElementsBeforeSharedDate = await knowledgeElementRepository.findUniqByUserId({
      userId,
      limitDate: campaignParticipation.sharedAt,
    });
    const isRetrying = await campaignParticipationRepository.isRetrying({
      campaignParticipationId: assessment.campaignParticipationId,
    });

    const knowledgeElementsForProgression = await improvementService.filterKnowledgeElementsIfImproving({
      knowledgeElements: knowledgeElementsBeforeSharedDate,
      assessment,
      isRetrying,
    });

    progression = new Progression({
      id: progressionId,
      targetedSkills: targetProfile?.skills,
      knowledgeElements: knowledgeElementsForProgression,
      isProfileCompleted: assessment.isCompleted(),
    });
  }

  if (assessment.isCompetenceEvaluation()) {
    const competenceEvaluation = await competenceEvaluationRepository.getByAssessmentId(assessmentId);
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
    const [targetedSkills, knowledgeElements] = await Promise.all([
      skillRepository.findActiveByCompetenceId(competenceEvaluation.competenceId),
      knowledgeElementRepository.findUniqByUserId({ userId }),
    ]);
    const knowledgeElementsForProgression = await improvementService.filterKnowledgeElementsIfImproving({
      knowledgeElements,
      assessment,
    });

    progression = new Progression({
      id: progressionId,
      targetedSkills,
      knowledgeElements: knowledgeElementsForProgression,
      isProfileCompleted: assessment.isCompleted(),
    });
  }

  return progression;
};
