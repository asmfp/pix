// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../models/Assessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceEvaluation = require('../models/CompetenceEvaluation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../models/KnowledgeElement');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
const Scorecard = require('../models/Scorecard');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

async function computeScorecard({
  userId,
  competenceId,
  competenceRepository,
  competenceEvaluationRepository,
  knowledgeElementRepository,
  allowExcessPix = false,
  allowExcessLevel = false,
  locale
}: any) {
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  const [knowledgeElements, competence, competenceEvaluations] = await Promise.all([
    knowledgeElementRepository.findUniqByUserIdAndCompetenceId({ userId, competenceId }),
    competenceRepository.get({ id: competenceId, locale }),
    competenceEvaluationRepository.findByUserId(userId),
  ]);

  const competenceEvaluation = _.find(competenceEvaluations, { competenceId: competence.id });

  return Scorecard.buildFrom({
    userId,
    knowledgeElements,
    competenceEvaluation,
    competence,
    allowExcessPix,
    allowExcessLevel,
  });
}

async function resetScorecard({
  userId,
  competenceId,
  shouldResetCompetenceEvaluation,
  assessmentRepository,
  knowledgeElementRepository,
  competenceEvaluationRepository,
  campaignParticipationRepository,
  targetProfileRepository
}: any) {
  const newKnowledgeElements = await _resetKnowledgeElements({ userId, competenceId, knowledgeElementRepository });

  const resetSkillIds = _.map(newKnowledgeElements, (knowledgeElement: any) => knowledgeElement.skillId);

  // user can have only answered to questions in campaign, in that case, competenceEvaluation does not exists
  if (shouldResetCompetenceEvaluation) {
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
    return Promise.all([
      newKnowledgeElements,
      _resetCampaignAssessments({
        userId,
        resetSkillIds,
        assessmentRepository,
        targetProfileRepository,
        campaignParticipationRepository,
      }),
      _resetCompetenceEvaluation({ userId, competenceId, competenceEvaluationRepository }),
    ]);
  }

  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  return Promise.all([
    newKnowledgeElements,
    _resetCampaignAssessments({
      userId,
      resetSkillIds,
      assessmentRepository,
      campaignParticipationRepository,
      targetProfileRepository,
    }),
  ]);
}

async function _resetKnowledgeElements({
  userId,
  competenceId,
  knowledgeElementRepository
}: any) {
  const knowledgeElements = await knowledgeElementRepository.findUniqByUserIdAndCompetenceId({
    userId,
    competenceId,
  });
  const resetKnowledgeElementsPromises = _.map(knowledgeElements, (knowledgeElement: any) => _resetKnowledgeElement({ knowledgeElement, knowledgeElementRepository })
  );
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  return Promise.all(resetKnowledgeElementsPromises);
}

function _resetKnowledgeElement({
  knowledgeElement,
  knowledgeElementRepository
}: any) {
  const newKnowledgeElement = {
    ...knowledgeElement,
    status: KnowledgeElement.StatusType.RESET,
    earnedPix: 0,
  };
  return knowledgeElementRepository.save(newKnowledgeElement);
}

function _resetCompetenceEvaluation({
  userId,
  competenceId,
  competenceEvaluationRepository
}: any) {
  return competenceEvaluationRepository.updateStatusByUserIdAndCompetenceId({
    competenceId,
    userId,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'statuses' does not exist on type 'typeof... Remove this comment to see the full error message
    status: CompetenceEvaluation.statuses.RESET,
  });
}

async function _resetCampaignAssessments({
  userId,
  resetSkillIds,
  assessmentRepository,
  campaignParticipationRepository,
  targetProfileRepository
}: any) {
  const notAbortedCampaignAssessments = await assessmentRepository.findNotAbortedCampaignAssessmentsByUserId(userId);

  if (!notAbortedCampaignAssessments) {
    return null;
  }

  const resetCampaignAssessmentsPromises = _.map(notAbortedCampaignAssessments, (campaignAssessment: any) => _resetCampaignAssessment({
    assessment: campaignAssessment,
    resetSkillIds,
    assessmentRepository,
    campaignParticipationRepository,
    targetProfileRepository,
  })
  );
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  return Promise.all(resetCampaignAssessmentsPromises);
}

async function _resetCampaignAssessment({
  assessment,
  resetSkillIds,
  assessmentRepository,
  campaignParticipationRepository,
  targetProfileRepository
}: any) {
  const campaignParticipation = await campaignParticipationRepository.get(assessment.campaignParticipationId);
  const targetProfile = await targetProfileRepository.getByCampaignParticipationId(assessment.campaignParticipationId);

  const resetSkillsNotIncludedInTargetProfile = _computeResetSkillsNotIncludedInTargetProfile({
    targetedSkillIds: targetProfile.skills.map((skill: any) => skill.id),
    resetSkillIds,
  });

  if (!campaignParticipation || campaignParticipation.isShared || resetSkillsNotIncludedInTargetProfile) {
    return null;
  }

  const newAssessment = Assessment.createForCampaign({
    userId: assessment.userId,
    campaignParticipationId: assessment.campaignParticipationId,
  });
  await assessmentRepository.abortByAssessmentId(assessment.id);
  return await assessmentRepository.save({ assessment: newAssessment });
}

function _computeResetSkillsNotIncludedInTargetProfile({
  targetedSkillIds,
  resetSkillIds
}: any) {
  return _(targetedSkillIds).intersection(resetSkillIds).isEmpty();
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  resetScorecard,
  computeScorecard,
  _computeResetSkillsNotIncludedInTargetProfile,
};
