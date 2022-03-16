// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../constants');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../domain/models/KnowledgeElement');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfKnowledgeElement = require('../orm-models/KnowledgeElement');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementSnapshotRepository = require('./knowledge-element-snapshot-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

function _getUniqMostRecents(knowledgeElements: any) {
  return _(knowledgeElements).orderBy('createdAt', 'desc').uniqBy('skillId').value();
}

function _dropResetKnowledgeElements(knowledgeElements: any) {
  return _.reject(knowledgeElements, { status: KnowledgeElement.StatusType.RESET });
}

function _applyFilters(knowledgeElements: any) {
  const uniqsMostRecentPerSkill = _getUniqMostRecents(knowledgeElements);
  return _dropResetKnowledgeElements(uniqsMostRecentPerSkill);
}

function _findByUserIdAndLimitDateQuery({
  userId,
  limitDate,
  domainTransaction = DomainTransaction.emptyTransaction()
}: any) {
  const knexConn = domainTransaction.knexTransaction || knex;
  return knexConn('knowledge-elements').where((qb: any) => {
    qb.where({ userId });
    if (limitDate) {
      qb.where('createdAt', '<', limitDate);
    }
  });
}

async function _findAssessedByUserIdAndLimitDateQuery({
  userId,
  limitDate,
  domainTransaction
}: any) {
  const knowledgeElementRows = await _findByUserIdAndLimitDateQuery({ userId, limitDate, domainTransaction });

  const knowledgeElements = _.map(
    knowledgeElementRows,
    (knowledgeElementRow: any) => new KnowledgeElement(knowledgeElementRow)
  );
  return _applyFilters(knowledgeElements);
}

async function _filterValidatedKnowledgeElementsByCampaignId(knowledgeElements: any, campaignId: any) {
  const targetProfileSkillsFromDB = await knex('target-profiles_skills')
    .select('target-profiles_skills.skillId')
    .join('target-profiles', 'target-profiles.id', 'target-profiles_skills.targetProfileId')
    .join('campaigns', 'campaigns.targetProfileId', 'target-profiles.id')
    .where('campaigns.id', '=', campaignId);

  const targetProfileSkillIds = _.map(targetProfileSkillsFromDB, 'skillId');

  return _.filter(knowledgeElements, (knowledgeElement: any) => {
    if (knowledgeElement.isInvalidated) {
      return false;
    }
    return _.includes(targetProfileSkillIds, knowledgeElement.skillId);
  });
}

async function _findSnapshotsForUsers(userIdsAndDates: any) {
  const knowledgeElementsGroupedByUser = await knowledgeElementSnapshotRepository.findByUserIdsAndSnappedAtDates(
    userIdsAndDates
  );

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  for (const [userIdStr, knowledgeElementsFromSnapshot] of Object.entries(knowledgeElementsGroupedByUser)) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    const userId = parseInt(userIdStr);
    let knowledgeElements = knowledgeElementsFromSnapshot;
    if (!knowledgeElements) {
      knowledgeElements = await _findAssessedByUserIdAndLimitDateQuery({
        userId,
        limitDate: userIdsAndDates[userId],
      });
    }
    knowledgeElementsGroupedByUser[userId] = knowledgeElements;
  }
  return knowledgeElementsGroupedByUser;
}

async function _countValidatedTargetedByCompetencesForUsers(userIdsAndDates: any, targetProfileWithLearningContent: any) {
  const knowledgeElementsGroupedByUser = await _findSnapshotsForUsers(userIdsAndDates);
  return targetProfileWithLearningContent.countValidatedTargetedKnowledgeElementsByCompetence(
    _.flatMap(knowledgeElementsGroupedByUser)
  );
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(knowledgeElement: any) {
    const knowledgeElementToSave = _.omit(knowledgeElement, ['id', 'createdAt']);
    const savedKnowledgeElement = await new BookshelfKnowledgeElement(knowledgeElementToSave).save();

    return bookshelfToDomainConverter.buildDomainObject(BookshelfKnowledgeElement, savedKnowledgeElement);
  },

  async findUniqByUserId({
    userId,
    limitDate,
    domainTransaction
  }: any) {
    return _findAssessedByUserIdAndLimitDateQuery({ userId, limitDate, domainTransaction });
  },

  async findUniqByUserIdAndAssessmentId({
    userId,
    assessmentId
  }: any) {
    const query = _findByUserIdAndLimitDateQuery({ userId });
    const knowledgeElementRows = await query.where({ assessmentId });

    const knowledgeElements = _.map(
      knowledgeElementRows,
      (knowledgeElementRow: any) => new KnowledgeElement(knowledgeElementRow)
    );
    return _applyFilters(knowledgeElements);
  },

  async findUniqByUserIdAndCompetenceId({
    userId,
    competenceId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    const query = _findByUserIdAndLimitDateQuery({ userId });
    const knowledgeElementRows = await query.where({ competenceId }, { transacting: domainTransaction });

    const knowledgeElements = _.map(
      knowledgeElementRows,
      (knowledgeElementRow: any) => new KnowledgeElement(knowledgeElementRow)
    );
    return _applyFilters(knowledgeElements);
  },

  async findUniqByUserIdGroupedByCompetenceId({
    userId,
    limitDate
  }: any) {
    const knowledgeElements = await this.findUniqByUserId({ userId, limitDate });
    return _.groupBy(knowledgeElements, 'competenceId');
  },

  async findByCampaignIdAndUserIdForSharedCampaignParticipation({
    campaignId,
    userId
  }: any) {
    const [sharedCampaignParticipation] = await knex('campaign-participations')
      .select('sharedAt')
      .where({ campaignId, status: SHARED, userId })
      .limit(1);

    if (!sharedCampaignParticipation) {
      return [];
    }

    const { sharedAt } = sharedCampaignParticipation;
    const knowledgeElements = await _findAssessedByUserIdAndLimitDateQuery({ userId, limitDate: sharedAt });

    return _filterValidatedKnowledgeElementsByCampaignId(knowledgeElements, campaignId);
  },

  async findByCampaignIdForSharedCampaignParticipation(campaignId: any) {
    const sharedCampaignParticipations = await knex('campaign-participations')
      .select('userId', 'sharedAt')
      .where({ campaignId, status: SHARED });

    const knowledgeElements = _.flatMap(
      await bluebird.map(
        sharedCampaignParticipations,
        async ({
          userId,
          sharedAt
        }: any) => {
          return _findAssessedByUserIdAndLimitDateQuery({ userId, limitDate: sharedAt });
        },
        { concurrency: constants.CONCURRENCY_HEAVY_OPERATIONS }
      )
    );

    return _filterValidatedKnowledgeElementsByCampaignId(knowledgeElements, campaignId);
  },

  async findSnapshotGroupedByCompetencesForUsers(userIdsAndDates: any) {
    const knowledgeElementsGroupedByUser = await _findSnapshotsForUsers(userIdsAndDates);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    for (const [userId, knowledgeElements] of Object.entries(knowledgeElementsGroupedByUser)) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      knowledgeElementsGroupedByUser[userId] = _.groupBy(knowledgeElements, 'competenceId');
    }
    return knowledgeElementsGroupedByUser;
  },

  async countValidatedTargetedByCompetencesForUsers(userIdsAndDates: any, targetProfileWithLearningContent: any) {
    return _countValidatedTargetedByCompetencesForUsers(userIdsAndDates, targetProfileWithLearningContent);
  },

  async countValidatedTargetedByCompetencesForOneUser(userId: any, limitDate: any, targetProfileWithLearningContent: any) {
    return _countValidatedTargetedByCompetencesForUsers({ [userId]: limitDate }, targetProfileWithLearningContent);
  },

  async findTargetedGroupedByCompetencesForUsers(userIdsAndDates: any, targetProfileWithLearningContent: any) {
    const knowledgeElementsGroupedByUser = await _findSnapshotsForUsers(userIdsAndDates);
    const knowledgeElementsGroupedByUserAndCompetence = {};

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    for (const [userId, knowledgeElements] of Object.entries(knowledgeElementsGroupedByUser)) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      knowledgeElementsGroupedByUserAndCompetence[userId] =
        targetProfileWithLearningContent.getKnowledgeElementsGroupedByCompetence(knowledgeElements);
    }

    return knowledgeElementsGroupedByUserAndCompetence;
  },

  async findValidatedTargetedGroupedByTubes(userIdsAndDates: any, targetProfileWithLearningContent: any) {
    const knowledgeElementsGroupedByUser = await _findSnapshotsForUsers(userIdsAndDates);

    return targetProfileWithLearningContent.getValidatedKnowledgeElementsGroupedByTube(
      _.flatMap(knowledgeElementsGroupedByUser)
    );
  },

  async findSnapshotForUsers(userIdsAndDates: any) {
    return _findSnapshotsForUsers(userIdsAndDates);
  },

  async findInvalidatedAndDirectByUserId(userId: any) {
    const invalidatedKnowledgeElements = await knex('knowledge-elements')
      .where({
        userId,
        status: KnowledgeElement.StatusType.INVALIDATED,
        source: KnowledgeElement.SourceType.DIRECT,
      })
      .orderBy('createdAt', 'desc');

    if (!invalidatedKnowledgeElements.length) {
      return [];
    }

    return invalidatedKnowledgeElements.map(
      (invalidatedKnowledgeElement: any) => new KnowledgeElement(invalidatedKnowledgeElement)
    );
  },
};
