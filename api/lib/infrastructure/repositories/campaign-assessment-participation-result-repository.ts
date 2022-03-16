// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipationResult = require('../../../lib/domain/read-models/CampaignAssessmentParticipationResult');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../lib/domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileWithLearningContentRepository = require('./target-profile-with-learning-content-repository');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getByCampaignIdAndCampaignParticipationId({
    campaignId,
    campaignParticipationId,
    locale
  }: any) {
    const targetProfileWithLearningContent = await targetProfileWithLearningContentRepository.getByCampaignId({
      campaignId,
      locale,
    });

    const result = await _fetchCampaignAssessmentParticipationResultAttributesFromCampaignParticipation(
      campaignId,
      campaignParticipationId
    );

    return _buildCampaignAssessmentParticipationResults(result, targetProfileWithLearningContent);
  },
};

async function _fetchCampaignAssessmentParticipationResultAttributesFromCampaignParticipation(
  campaignId: any,
  campaignParticipationId: any
) {
  const [campaignAssessmentParticipationResult] = await knex
    .with('campaignAssessmentParticipationResult', (qb: any) => {
      qb.select([
        'users.id AS userId',
        'campaign-participations.id AS campaignParticipationId',
        'campaign-participations.campaignId',
        'campaign-participations.sharedAt',
        'campaign-participations.status',
      ])
        .from('campaign-participations')
        .join('assessments', 'assessments.campaignParticipationId', 'campaign-participations.id')
        .join('users', 'users.id', 'campaign-participations.userId')
        .leftJoin('campaigns', 'campaign-participations.campaignId', 'campaigns.id')
        .where({
          campaignId,
          'campaign-participations.id': campaignParticipationId,
        });
    })
    .from('campaignAssessmentParticipationResult');

  if (campaignAssessmentParticipationResult == null) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`There is no campaign participation with the id "${campaignParticipationId}"`);
  }

  return campaignAssessmentParticipationResult;
}

async function _buildCampaignAssessmentParticipationResults(result: any, targetProfileWithLearningContent: any) {
  const validatedTargetedKnowledgeElementsCountByCompetenceId =
    await knowledgeElementRepository.countValidatedTargetedByCompetencesForOneUser(
      result.userId,
      result.sharedAt,
      targetProfileWithLearningContent
    );

  return new CampaignAssessmentParticipationResult({
    ...result,
    targetedCompetences: targetProfileWithLearningContent.competences,
    validatedTargetedKnowledgeElementsCountByCompetenceId,
    targetProfile: targetProfileWithLearningContent,
  });
}
