// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileWithLearningContent = require('../../domain/models/TargetProfileWithLearningContent');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetedSk... Remove this comment to see the full error message
const TargetedSkill = require('../../domain/models/TargetedSkill');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetedTu... Remove this comment to see the full error message
const TargetedTube = require('../../domain/models/TargetedTube');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetedCo... Remove this comment to see the full error message
const TargetedCompetence = require('../../domain/models/TargetedCompetence');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetedAr... Remove this comment to see the full error message
const TargetedArea = require('../../domain/models/TargetedArea');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../domain/models/Badge');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../../domain/models/BadgeCriterion');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SkillSet'.
const SkillSet = require('../../domain/models/SkillSet');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Stage'.
const Stage = require('../../domain/models/Stage');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tubeDataso... Remove this comment to see the full error message
const tubeDatasource = require('../datasources/learning-content/tube-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceDatasource = require('../datasources/learning-content/competence-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'areaDataso... Remove this comment to see the full error message
const areaDatasource = require('../datasources/learning-content/area-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, TargetProfileInvalidError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'FRENCH_FRA... Remove this comment to see the full error message
const { FRENCH_FRANCE } = require('../../domain/constants').LOCALE;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getTransla... Remove this comment to see the full error message
const { getTranslatedText } = require('../../domain/services/get-translated-text');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get({
    id,
    locale = FRENCH_FRANCE
  }: any) {
    const whereClauseFnc = (queryBuilder: any) => {
      return queryBuilder.where('target-profiles.id', id);
    };

    return _get(whereClauseFnc, locale);
  },

  async getByCampaignId({
    campaignId,
    locale = FRENCH_FRANCE
  }: any) {
    const whereClauseFnc = (queryBuilder: any) => {
      return queryBuilder
        .join('campaigns', 'campaigns.targetProfileId', 'target-profiles.id')
        .where('campaigns.id', campaignId);
    };

    return _get(whereClauseFnc, locale);
  },
};

async function _get(whereClauseFnc: any, locale: any) {
  const baseQueryBuilder = knex('target-profiles')
    .select(
      'target-profiles.id',
      'target-profiles.name',
      'target-profiles.outdated',
      'target-profiles.isPublic',
      'target-profiles.imageUrl',
      'target-profiles.createdAt',
      'target-profiles.description',
      'target-profiles.comment',
      'target-profiles.ownerOrganizationId',
      'target-profiles.category',
      'target-profiles.isSimplifiedAccess',
      'target-profiles_skills.skillId'
    )
    .leftJoin('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'target-profiles.id');
  const finalQueryBuilder = whereClauseFnc(baseQueryBuilder);
  const results = await finalQueryBuilder;

  if (_.isEmpty(results)) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError("Le profil cible n'existe pas");
  }

  const badges = await _findBadges(results[0].id);
  const stages = await _findStages(results[0].id);
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 4.
  return _toDomain(results, badges, stages, locale);
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
async function _toDomain(results: any, badges: any, stages: any, locale: any) {
  const skillIds = _.compact(results.map(({
    skillId
  }: any) => skillId));
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'skills' does not exist on type '{}'.
  const { skills, tubes, competences, areas } = await _getTargetedLearningContent(skillIds, locale);

  return new TargetProfileWithLearningContent({
    id: results[0].id,
    name: results[0].name,
    outdated: results[0].outdated,
    isPublic: results[0].isPublic,
    createdAt: results[0].createdAt,
    ownerOrganizationId: results[0].ownerOrganizationId,
    imageUrl: results[0].imageUrl,
    description: results[0].description,
    comment: results[0].comment,
    category: results[0].category,
    isSimplifiedAccess: results[0].isSimplifiedAccess,
    skills,
    tubes,
    competences,
    areas,
    badges,
    stages,
  });
}

async function _getTargetedLearningContent(skillIds: any, locale: any) {
  const skills = await _findTargetedSkills(skillIds);
  if (_.isEmpty(skills)) {
    throw new TargetProfileInvalidError();
  }
  const tubes = await _findTargetedTubes(skills, locale);
  const competences = await _findTargetedCompetences(tubes, locale);
  const areas = await _findTargetedAreas(competences, locale);

  return {
    skills,
    tubes,
    competences,
    areas,
  };
}

async function _findTargetedSkills(skillIds: any) {
  const learningContentSkills = await skillDatasource.findOperativeByRecordIds(skillIds);
  return learningContentSkills.map((learningContentSkill: any) => {
    return new TargetedSkill(learningContentSkill);
  });
}

async function _findTargetedTubes(skills: any, locale: any) {
  const skillsByTubeId = _.groupBy(skills, 'tubeId');
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  const learningContentTubes = await tubeDatasource.findByRecordIds(Object.keys(skillsByTubeId));
  return learningContentTubes.map((learningContentTube: any) => {
    const practicalTitle = getTranslatedText(locale, {
      frenchText: learningContentTube.practicalTitleFrFr,
      englishText: learningContentTube.practicalTitleEnUs,
    });
    const description = getTranslatedText(locale, {
      frenchText: learningContentTube.practicalDescriptionFrFr,
      englishText: learningContentTube.practicalDescriptionEnUs,
    });
    return new TargetedTube({
      ...learningContentTube,
      practicalTitle,
      description,
      skills: skillsByTubeId[learningContentTube.id],
    });
  });
}

async function _findTargetedCompetences(tubes: any, locale: any) {
  const tubesByCompetenceId = _.groupBy(tubes, 'competenceId');
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  const learningContentCompetences = await competenceDatasource.findByRecordIds(Object.keys(tubesByCompetenceId));
  return learningContentCompetences.map((learningContentCompetence: any) => {
    const name = getTranslatedText(locale, {
      frenchText: learningContentCompetence.nameFrFr,
      englishText: learningContentCompetence.nameEnUs,
    });
    return new TargetedCompetence({
      ...learningContentCompetence,
      name,
      tubes: tubesByCompetenceId[learningContentCompetence.id],
    });
  });
}

async function _findTargetedAreas(competences: any, locale: any) {
  const competencesByAreaId = _.groupBy(competences, 'areaId');
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  const learningContentAreas = await areaDatasource.findByRecordIds(Object.keys(competencesByAreaId));
  return learningContentAreas.map((learningContentArea: any) => {
    const title = getTranslatedText(locale, {
      frenchText: learningContentArea.titleFrFr,
      englishText: learningContentArea.titleEnUs,
    });
    return new TargetedArea({
      ...learningContentArea,
      title,
      competences: competencesByAreaId[learningContentArea.id],
    });
  });
}

async function _findStages(targetProfileId: any) {
  const stageRows = await knex('stages')
    .select(
      'stages.id',
      'stages.threshold',
      'stages.message',
      'stages.title',
      'stages.prescriberTitle',
      'stages.prescriberDescription'
    )
    .where('stages.targetProfileId', targetProfileId);

  if (_.isEmpty(stageRows)) {
    return [];
  }

  return stageRows.map((row: any) => new Stage(row));
}

async function _findBadges(targetProfileId: any) {
  const badgeRows = await knex('badges')
    .select(
      'badges.id',
      'badges.key',
      'badges.message',
      'badges.altMessage',
      'badges.isCertifiable',
      'badges.title',
      'badges.targetProfileId'
    )
    .where('badges.targetProfileId', targetProfileId);

  if (_.isEmpty(badgeRows)) {
    return [];
  }

  const badges = badgeRows.map((row: any) => new Badge({ ...row, imageUrl: null }));
  await _fillBadgesWithCriteria(badges);
  await _fillBadgesWithSkillSets(badges);

  return badges;
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _fillBadgesWithCriteria(badges: any) {
  const badgeIds = badges.map((badge: any) => badge.id);
  const criteriaRows = await knex('badge-criteria')
    .select(
      'badge-criteria.id',
      'badge-criteria.scope',
      'badge-criteria.threshold',
      'badge-criteria.badgeId',
      'badge-criteria.skillSetIds'
    )
    .whereIn('badge-criteria.badgeId', badgeIds);

  const criteriaRowsByBadgeId = _.groupBy(criteriaRows, 'badgeId');

  badges.forEach((badge: any) => {
    const criteriaRowsForBadge = criteriaRowsByBadgeId[badge.id];
    badge.badgeCriteria = _.map(criteriaRowsForBadge, (criteriaRow: any) => new BadgeCriterion(criteriaRow));
  });
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _fillBadgesWithSkillSets(badges: any) {
  const badgeIds = badges.map((badge: any) => badge.id);
  const skillSetRows = await knex('skill-sets')
    .select('skill-sets.id', 'skill-sets.name', 'skill-sets.skillIds', 'skill-sets.badgeId')
    .whereIn('skill-sets.badgeId', badgeIds);

  const skillSetRowsByBadgeId = _.groupBy(skillSetRows, 'badgeId');

  badges.forEach((badge: any) => {
    const skillSetRowsForBadge = skillSetRowsByBadgeId[badge.id];
    badge.skillSets = _.map(skillSetRowsForBadge, (skillSetRow: any) => new SkillSet(skillSetRow));
  });
}
