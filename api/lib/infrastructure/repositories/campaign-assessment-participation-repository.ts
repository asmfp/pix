// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../lib/domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipation = require('../../../lib/domain/read-models/CampaignAssessmentParticipation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('./target-profile-repository');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../lib/domain/models/Assessment');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getByCampaignIdAndCampaignParticipationId({
    campaignId,
    campaignParticipationId
  }: any) {
    const result = await _fetchCampaignAssessmentAttributesFromCampaignParticipation(
      campaignId,
      campaignParticipationId
    );

    return _buildCampaignAssessmentParticipation(result);
  },
};

async function _fetchCampaignAssessmentAttributesFromCampaignParticipation(campaignId: any, campaignParticipationId: any) {
  const [campaignAssessmentParticipation] = await knex
    .with('campaignAssessmentParticipation', (qb: any) => {
      qb.select([
        'campaign-participations.userId',
        'schooling-registrations.firstName',
        'schooling-registrations.lastName',
        'campaign-participations.id AS campaignParticipationId',
        'campaign-participations.campaignId',
        'campaign-participations.createdAt',
        'campaign-participations.sharedAt',
        'campaign-participations.status',
        'campaign-participations.participantExternalId',
        'campaign-participations.masteryRate',
        'assessments.state AS assessmentState',
        _assessmentRankByCreationDate(),
      ])
        .from('campaign-participations')
        .join('assessments', 'assessments.campaignParticipationId', 'campaign-participations.id')
        .join(
          'schooling-registrations',
          'schooling-registrations.id',
          'campaign-participations.schoolingRegistrationId'
        )
        .where({
          'campaign-participations.id': campaignParticipationId,
        });
    })
    .from('campaignAssessmentParticipation')
    .where({ rank: 1 });

  if (campaignAssessmentParticipation == null) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`There is no campaign participation with the id "${campaignParticipationId}"`);
  }

  return campaignAssessmentParticipation;
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _assessmentRankByCreationDate() {
  return knex.raw('ROW_NUMBER() OVER (PARTITION BY ?? ORDER BY ?? DESC) AS rank', [
    'assessments.campaignParticipationId',
    'assessments.createdAt',
  ]);
}

async function _buildCampaignAssessmentParticipation(result: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'targetedSkillsCount' does not exist on t... Remove this comment to see the full error message
  const { targetedSkillsCount, testedSkillsCount } = await _setSkillsCount(result);

  return new CampaignAssessmentParticipation({
    ...result,
    targetedSkillsCount,
    testedSkillsCount,
  });
}

async function _setSkillsCount(result: any) {
  let targetedSkillsCount = 0;
  let testedSkillsCount = 0;

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
  if (result.assessmentState !== Assessment.states.COMPLETED) {
    const targetProfile = await targetProfileRepository.getByCampaignId(result.campaignId);
    const targetedSkillIds = targetProfile.skills.map(({
      id
    }: any) => id);

    const knowledgeElementsByUser = await knowledgeElementRepository.findSnapshotForUsers({
      [result.userId]: result.sharedAt,
    });
    const knowledgeElements = knowledgeElementsByUser[result.userId];

    targetedSkillsCount = targetedSkillIds.length;
    testedSkillsCount = _getTestedSkillsCountInTargetProfile(result, targetedSkillIds, knowledgeElements);
  }

  return { targetedSkillsCount, testedSkillsCount };
}

function _getTestedSkillsCountInTargetProfile(result: any, targetedSkillIds: any, knowledgeElements: any) {
  const testedKnowledgeElements = _.filter(
    knowledgeElements,
    (knowledgeElement: any) => knowledgeElement.isValidated || knowledgeElement.isInvalidated
  );
  const testedSkillIds = _.map(testedKnowledgeElements, 'skillId');
  const testedTargetedSkillIdsByUser = _.intersection(testedSkillIds, targetedSkillIds);

  return testedTargetedSkillIdsByUser.length;
}
