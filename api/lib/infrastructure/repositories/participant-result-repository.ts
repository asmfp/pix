// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../domain/models/Assessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../domain/read-models/participant-results/AssessmentResult');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('./competence-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const flashAssessmentResultRepository = require('./flash-assessment-result-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

const ParticipantResultRepository = {
  async getByUserIdAndCampaignId({
    userId,
    campaignId,
    locale
  }: any) {
    const [participationResults, targetProfile, isCampaignMultipleSendings, isRegistrationActive, isCampaignArchived] =
      // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
      await Promise.all([
        _getParticipationResults(userId, campaignId),
        _getTargetProfile(campaignId, locale),
        _isCampaignMultipleSendings(campaignId),
        _isRegistrationActive(userId, campaignId),
        _isCampaignArchived(campaignId),
      ]);

    return new AssessmentResult(
      participationResults,
      targetProfile,
      isCampaignMultipleSendings,
      isRegistrationActive,
      isCampaignArchived
    );
  },
};

async function _getParticipationResults(userId: any, campaignId: any) {
  const {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isCompleted' does not exist on type '{}'... Remove this comment to see the full error message
    isCompleted,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'campaignParticipationId' does not exist ... Remove this comment to see the full error message
    campaignParticipationId,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sharedAt' does not exist on type '{}'.
    sharedAt,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'assessmentCreatedAt' does not exist on t... Remove this comment to see the full error message
    assessmentCreatedAt,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'participantExternalId' does not exist on... Remove this comment to see the full error message
    participantExternalId,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'masteryRate' does not exist on type '{}'... Remove this comment to see the full error message
    masteryRate,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isFlash' does not exist on type '{}'.
    isFlash,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'assessmentId' does not exist on type '{}... Remove this comment to see the full error message
    assessmentId,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isDeleted' does not exist on type '{}'.
    isDeleted,
  } = await _getParticipationAttributes(userId, campaignId);

  const knowledgeElements = await _findTargetedKnowledgeElements(campaignId, userId, sharedAt);

  const acquiredBadgeIds = await _getAcquiredBadgeIds(userId, campaignParticipationId);

  let estimatedFlashLevel;
  if (isFlash) estimatedFlashLevel = await _getEstimatedFlashLevel(assessmentId);

  return {
    campaignParticipationId,
    isCompleted,
    sharedAt,
    assessmentCreatedAt,
    participantExternalId,
    knowledgeElements,
    masteryRate,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'map' does not exist on type 'unknown'.
    acquiredBadgeIds: acquiredBadgeIds.map(({
      badgeId
    }: any) => badgeId),
    estimatedFlashLevel,
    isDeleted,
  };
}

async function _getParticipationAttributes(userId: any, campaignId: any) {
  const participationAttributes = await knex('campaign-participations')
    .select([
      'state',
      'campaignParticipationId',
      'sharedAt',
      'assessments.createdAt AS assessmentCreatedAt',
      'participantExternalId',
      knex.raw('CAST("masteryRate" AS FLOAT)'),
      'method',
      'assessments.id AS assessmentId',
      'deletedAt',
    ])
    .join('assessments', 'campaign-participations.id', 'assessments.campaignParticipationId')
    .where({ 'campaign-participations.campaignId': campaignId })
    .andWhere({ 'campaign-participations.userId': userId })
    .andWhere('campaign-participations.isImproved', '=', false)
    .orderBy('assessments.createdAt', 'DESC')
    .first();

  if (!participationAttributes) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`Participation not found for user ${userId} and campaign ${campaignId}`);
  }

  const {
    state,
    campaignParticipationId,
    sharedAt,
    assessmentCreatedAt,
    participantExternalId,
    masteryRate,
    method,
    assessmentId,
    deletedAt,
  } = participationAttributes;

  return {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
    isCompleted: state === Assessment.states.COMPLETED,
    campaignParticipationId,
    sharedAt,
    assessmentCreatedAt,
    participantExternalId,
    masteryRate,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'methods' does not exist on type 'typeof ... Remove this comment to see the full error message
    isFlash: method === Assessment.methods.FLASH,
    assessmentId,
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    isDeleted: Boolean(deletedAt),
  };
}

async function _findTargetedKnowledgeElements(campaignId: any, userId: any, sharedAt: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'targetProfileId' does not exist on type ... Remove this comment to see the full error message
  const { targetProfileId } = await _getTargetProfileId(campaignId);
  const targetedSkillIds = await _findTargetedSkillIds(targetProfileId);
  const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId, limitDate: sharedAt });
  return knowledgeElements.filter(({
    skillId
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type 'unknow... Remove this comment to see the full error message
  }: any) => targetedSkillIds.includes(skillId));
}

async function _getAcquiredBadgeIds(userId: any, campaignParticipationId: any) {
  return knex('badge-acquisitions').select('badgeId').where({ userId, campaignParticipationId });
}

async function _getTargetProfile(campaignId: any, locale: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'targetProfileId' does not exist on type ... Remove this comment to see the full error message
  const { targetProfileId } = await _getTargetProfileId(campaignId);

  const competences = await _findTargetedCompetences(targetProfileId, locale);
  const stages = await _getStages(targetProfileId);
  const badges = await _getBadges(targetProfileId);

  return { competences, stages, badges };
}

async function _getTargetProfileId(campaignId: any) {
  return knex('campaigns').select('targetProfileId').where({ 'campaigns.id': campaignId }).first();
}

function _getStages(targetProfileId: any) {
  return knex('stages').where({ targetProfileId });
}

async function _getBadges(targetProfileId: any) {
  const badges = await knex('badges').where({ targetProfileId });
  const competences = await _findSkillSet(badges);
  return badges.map((badge: any) => {
    const badgeCompetences = competences.filter(({
      badgeId
    }: any) => badgeId === badge.id);

    return {
      ...badge,
      badgeCompetences,
    };
  });
}

function _findSkillSet(badges: any) {
  return knex('skill-sets').whereIn(
    'badgeId',
    badges.map(({
      id
    }: any) => id)
  );
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
async function _findTargetedCompetences(targetProfileId: any, locale: any) {
  const targetedSkillIds = await _findTargetedSkillIds(targetProfileId);
  const competences = await competenceRepository.list({ locale });
  const targetedCompetences: any = [];

  competences.forEach((competence: any) => {
    const matchingSkills = _.intersection(competence.skillIds, targetedSkillIds);

    if (matchingSkills.length > 0) {
      targetedCompetences.push({
        id: competence.id,
        name: competence.name,
        index: competence.index,
        areaName: competence.area.name,
        areaColor: competence.area.color,
        skillIds: matchingSkills,
      });
    }
  });

  return targetedCompetences;
}

async function _findTargetedSkillIds(targetProfileId: any) {
  const targetProfileSkillIds = await knex('target-profiles_skills')
    .select('skillId')
    .where({ targetProfileId })
    .then((skills: any) => skills.map(({
    skillId
  }: any) => skillId));
  const targetedSkills = await skillDatasource.findOperativeByRecordIds(targetProfileSkillIds);
  return targetedSkills.map(({
    id
  }: any) => id);
}

async function _isCampaignMultipleSendings(campaignId: any) {
  const campaign = await knex('campaigns').select('multipleSendings').where({ 'campaigns.id': campaignId }).first();
  return campaign.multipleSendings;
}

async function _isCampaignArchived(campaignId: any) {
  const campaign = await knex('campaigns').select('archivedAt').where({ 'campaigns.id': campaignId }).first();
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
  return Boolean(campaign.archivedAt);
}

async function _isRegistrationActive(userId: any, campaignId: any) {
  const registration = await knex('schooling-registrations')
    .select('schooling-registrations.isDisabled')
    .join('organizations', 'organizations.id', 'schooling-registrations.organizationId')
    .join('campaigns', 'campaigns.organizationId', 'organizations.id')
    .where({ 'campaigns.id': campaignId })
    .andWhere({ 'schooling-registrations.userId': userId })
    .first();
  return !registration?.isDisabled;
}

async function _getEstimatedFlashLevel(assessmentId: any) {
  const flashAssessmentResult = await flashAssessmentResultRepository.getLatestByAssessmentId(assessmentId);
  return flashAssessmentResult?.estimatedLevel;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ParticipantResultRepository;
