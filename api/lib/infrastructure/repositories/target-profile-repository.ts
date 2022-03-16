// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfTargetProfile = require('../orm-models/TargetProfile');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const targetProfileAdapter = require('../adapters/target-profile-adapter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
  TargetProfileCannotBeCreated,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
  ObjectValidationError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidSki... Remove this comment to see the full error message
  InvalidSkillSetError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('../../domain/models/TargetProfile');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async create(targetProfileData: any) {
    const targetProfileRawData = _.pick(targetProfileData, [
      'name',
      'isPublic',
      'imageUrl',
      'ownerOrganizationId',
      'comment',
      'description',
      'category',
    ]);

    const trx = await knex.transaction();

    try {
      const [targetProfileId] = await trx('target-profiles').insert(targetProfileRawData).returning('id');

      const skillsIdList = _.uniq(targetProfileData.skillIds);

      const skillToAdd = skillsIdList.map((skillId: any) => {
        return { targetProfileId, skillId };
      });

      await trx.batchInsert('target-profiles_skills', skillToAdd);

      await trx.commit();

      return targetProfileId;
    } catch (e) {
      await trx.rollback();

      throw new TargetProfileCannotBeCreated();
    }
  },

  async get(id: any, domainTransaction = DomainTransaction.emptyTransaction()) {
    const targetProfileBookshelf = await BookshelfTargetProfile.where({ id }).fetch({
      require: false,
      withRelated: ['skillIds'],
      transacting: domainTransaction.knexTransaction,
    });

    if (!targetProfileBookshelf) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`Le profil cible avec l'id ${id} n'existe pas`);
    }

    return _getWithLearningContentSkills(targetProfileBookshelf);
  },

  async getByCampaignId(campaignId: any) {
    const targetProfileBookshelf = await BookshelfTargetProfile.query((qb: any) => {
      qb.innerJoin('campaigns', 'campaigns.targetProfileId', 'target-profiles.id');
      qb.innerJoin('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'target-profiles.id');
    })
      .where({ 'campaigns.id': campaignId })
      .fetch({
        withRelated: [
          'skillIds',
          {
            stages: function (query: any) {
              query.orderBy('threshold', 'ASC');
            },
          },
        ],
      });

    return _getWithLearningContentSkills(targetProfileBookshelf);
  },

  async getByCampaignParticipationId(campaignParticipationId: any) {
    const targetProfileBookshelf = await BookshelfTargetProfile.query((qb: any) => {
      qb.innerJoin('campaigns', 'campaigns.targetProfileId', 'target-profiles.id');
      qb.innerJoin('campaign-participations', 'campaign-participations.campaignId', 'campaigns.id');
      qb.innerJoin('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'target-profiles.id');
    })
      .where({ 'campaign-participations.id': campaignParticipationId })
      .fetch({
        withRelated: [
          'skillIds',
          {
            stages: function (query: any) {
              query.orderBy('threshold', 'ASC');
            },
          },
        ],
      });

    return _getWithLearningContentSkills(targetProfileBookshelf);
  },

  async findAllTargetProfilesOrganizationCanUse(ownerOrganizationId: any) {
    const targetProfilesBookshelf = await BookshelfTargetProfile.query((qb: any) => {
      qb.where({ ownerOrganizationId, outdated: false });
      qb.orWhere({ isPublic: true, outdated: false });
    }).fetchAll({ withRelated: ['skillIds'] });

    return bluebird.mapSeries(targetProfilesBookshelf, _getWithLearningContentSkills);
  },

  async findByIds(targetProfileIds: any) {
    const targetProfilesBookshelf = await BookshelfTargetProfile.query((qb: any) => {
      qb.whereIn('id', targetProfileIds);
    }).fetchAll();

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfTargetProfile, targetProfilesBookshelf);
  },

  findPaginatedFiltered({
    filter,
    page
  }: any) {
    return BookshelfTargetProfile.query((qb: any) => _setSearchFiltersForQueryBuilder(filter, qb))
      .fetchPage({
        page: page.number,
        pageSize: page.size,
      })
      .then(({
      models,
      pagination
    }: any) => {
        const targetProfiles = bookshelfToDomainConverter.buildDomainObjects(BookshelfTargetProfile, models);
        return { models: targetProfiles, pagination };
      });
  },

  async update(targetProfile: any) {
    let results;
    const editedAttributes = _.pick(targetProfile, [
      'name',
      'outdated',
      'description',
      'comment',
      'isSimplifiedAccess',
    ]);

    try {
      results = await knex('target-profiles')
        .where({ id: targetProfile.id })
        .update(editedAttributes)
        .returning(['id', 'isSimplifiedAccess']);
    } catch (error) {
      throw new ObjectValidationError();
    }

    if (!results.length) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`Le profil cible avec l'id ${targetProfile.id} n'existe pas`);
    }

    return new TargetProfile(results[0]);
  },

  async findOrganizationIds(targetProfileId: any) {
    const targetProfile = await knex('target-profiles').select('id').where({ id: targetProfileId }).first();
    if (!targetProfile) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`No target profile for ID ${targetProfileId}`);
    }

    const targetProfileShares = await knex('target-profile-shares')
      .select('organizationId')
      .where({ 'target-profile-shares.targetProfileId': targetProfileId });
    return targetProfileShares.map((targetProfileShare: any) => targetProfileShare.organizationId);
  },

  async hasSkills({
    targetProfileId,
    skillIds
  }: any, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const result = await (knexTransaction ?? knex)('target-profiles_skills')
      .select('skillId')
      .whereIn('skillId', skillIds)
      .andWhere('targetProfileId', targetProfileId);

    const unknownSkillIds = _.difference(skillIds, _.map(result, 'skillId'));
    if (unknownSkillIds.length) {
      throw new InvalidSkillSetError(`Unknown skillIds : ${unknownSkillIds}`);
    }

    return true;
  },
};

async function _getWithLearningContentSkills(targetProfile: any) {
  const associatedSkillDatasourceObjects = await _getLearningContentDataObjectsSkills(targetProfile);

  return targetProfileAdapter.fromDatasourceObjects({
    bookshelfTargetProfile: targetProfile,
    associatedSkillDatasourceObjects,
  });
}

function _getLearningContentDataObjectsSkills(bookshelfTargetProfile: any) {
  const skillRecordIds = bookshelfTargetProfile
    .related('skillIds')
    .map((BookshelfSkillId: any) => BookshelfSkillId.get('skillId'));
  return skillDatasource.findOperativeByRecordIds(skillRecordIds);
}

function _setSearchFiltersForQueryBuilder(filter: any, qb: any) {
  const { name, id } = filter;
  if (name) {
    qb.whereRaw('LOWER("name") LIKE ?', `%${name.toLowerCase()}%`);
  }
  if (id) {
    qb.where({ id });
  }
}
