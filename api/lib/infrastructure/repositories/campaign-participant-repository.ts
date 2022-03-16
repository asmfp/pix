// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const pick = require('lodash/pick');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipant = require('../../domain/models/CampaignParticipant');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignTo... Remove this comment to see the full error message
const CampaignToStartParticipation = require('../../domain/models/CampaignToStartParticipation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingCampaignParticipationError, NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');

async function save(campaignParticipant: any, domainTransaction: any) {
  const newlyCreatedSchoolingRegistrationId = await _createNewSchoolingRegistration(
    campaignParticipant.schoolingRegistration,
    domainTransaction.knexTransaction
  );
  if (newlyCreatedSchoolingRegistrationId) {
    campaignParticipant.campaignParticipation.schoolingRegistrationId = newlyCreatedSchoolingRegistrationId;
  }

  await _updatePreviousParticipation(
    campaignParticipant.previousCampaignParticipation,
    domainTransaction.knexTransaction
  );
  const campaignParticipationId = await _createNewCampaignParticipation(
    domainTransaction.knexTransaction,
    campaignParticipant.campaignParticipation
  );
  await _createAssessment(campaignParticipant.assessment, campaignParticipationId, domainTransaction.knexTransaction);
  return campaignParticipationId;
}

async function _createNewSchoolingRegistration(schoolingRegistration: any, queryBuilder: any) {
  if (schoolingRegistration) {
    const [newlyCreatedSchoolingRegistrationId] = await queryBuilder('schooling-registrations')
      .insert({
        userId: schoolingRegistration.userId,
        organizationId: schoolingRegistration.organizationId,
        firstName: schoolingRegistration.firstName,
        lastName: schoolingRegistration.lastName,
      })
      .returning('id');
    return newlyCreatedSchoolingRegistrationId;
  }
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _updatePreviousParticipation(campaignParticipation: any, queryBuilder: any) {
  if (campaignParticipation) {
    await queryBuilder('campaign-participations')
      .update({ isImproved: campaignParticipation.isImproved })
      .where({ id: campaignParticipation.id });
  }
}

async function _createNewCampaignParticipation(queryBuilder: any, campaignParticipation: any) {
  try {
    const [id] = await queryBuilder('campaign-participations')
      .insert({
        campaignId: campaignParticipation.campaignId,
        userId: campaignParticipation.userId,
        status: campaignParticipation.status,
        schoolingRegistrationId: campaignParticipation.schoolingRegistrationId,
        participantExternalId: campaignParticipation.participantExternalId,
      })
      .returning('id');

    return id;
  } catch (error) {
    if (error.constraint === 'campaign_participations_campaignid_userid_isimproved_deleted') {
      throw new AlreadyExistingCampaignParticipationError(
        `User ${campaignParticipation.userId} has already a campaign participation with campaign ${campaignParticipation.campaignId}`
      );
    }
    throw error;
  }
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _createAssessment(assessment: any, campaignParticipationId: any, queryBuilder: any) {
  if (assessment) {
    const assessmentAttributes = pick(assessment, ['userId', 'method', 'state', 'type', 'courseId', 'isImproving']);
    await queryBuilder('assessments').insert({ campaignParticipationId, ...assessmentAttributes });
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'get'.
async function get({
  userId,
  campaignId,
  domainTransaction
}: any) {
  const userIdentity = await _getUserIdentityForTrainee(userId, domainTransaction);

  const campaignToStartParticipation = await _getCampaignToStart(campaignId, domainTransaction);

  const schoolingRegistrationId = await _getSchoolingRegistrationId(campaignId, userId, domainTransaction);

  const previousCampaignParticipation = await _findPreviousCampaignParticipation(campaignId, userId, domainTransaction);

  return new CampaignParticipant({
    userIdentity,
    campaignToStartParticipation,
    schoolingRegistrationId,
    previousCampaignParticipation,
  });
}

function _getUserIdentityForTrainee(userId: any, domainTransaction: any) {
  return domainTransaction.knexTransaction('users').select('id', 'firstName', 'lastName').where({ id: userId }).first();
}

async function _getCampaignToStart(campaignId: any, domainTransaction: any) {
  const campaignAttributes = await domainTransaction
    .knexTransaction('campaigns')
    .join('organizations', 'organizations.id', 'organizationId')
    .select([
      'campaigns.id',
      'campaigns.type',
      'idPixLabel',
      'campaigns.archivedAt',
      'isManagingStudents AS isRestricted',
      'multipleSendings',
      'assessmentMethod',
      'organizationId',
    ])
    .where({ 'campaigns.id': campaignId })
    .first();

  if (!campaignAttributes) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`La campagne d'id ${campaignId} n'existe pas ou son accès est restreint`);
  }
  const skillIds = await domainTransaction
    .knexTransaction('target-profiles_skills')
    .join('campaigns', 'campaigns.targetProfileId', 'target-profiles_skills.targetProfileId')
    .where({ 'campaigns.id': campaignId })
    .pluck('skillId');

  const skills = await skillDatasource.findOperativeByRecordIds(skillIds);

  return new CampaignToStartParticipation({ ...campaignAttributes, skillCount: skills.length });
}

async function _getSchoolingRegistrationId(campaignId: any, userId: any, domainTransaction: any) {
  const [id] = await domainTransaction
    .knexTransaction('campaigns')
    .join('schooling-registrations', 'schooling-registrations.organizationId', 'campaigns.organizationId')
    .where({ 'campaigns.id': campaignId, userId, isDisabled: false })
    .pluck('schooling-registrations.id');

  return id;
}

async function _findPreviousCampaignParticipation(campaignId: any, userId: any, domainTransaction: any) {
  const campaignParticipationAttributes = await domainTransaction
    .knexTransaction('campaign-participations')
    .select('id', 'participantExternalId', 'validatedSkillsCount', 'status', 'deletedAt')
    .where({ campaignId, userId, isImproved: false })
    .first();

  if (!campaignParticipationAttributes) return null;
  return {
    id: campaignParticipationAttributes.id,
    participantExternalId: campaignParticipationAttributes.participantExternalId,
    validatedSkillsCount: campaignParticipationAttributes.validatedSkillsCount,
    status: campaignParticipationAttributes.status,
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    isDeleted: Boolean(campaignParticipationAttributes.deletedAt),
  };
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  get,
  save,
};
