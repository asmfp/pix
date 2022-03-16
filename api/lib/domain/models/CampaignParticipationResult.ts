// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationService = require('../services/campaign-participation-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceResult = require('./CompetenceResult');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationBadge = require('./CampaignParticipationBadge');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipationResult {
  campaignParticipationBadges: any;
  competenceResults: any;
  id: any;
  isCompleted: any;
  knowledgeElementsCount: any;
  reachedStage: any;
  stageCount: any;
  testedSkillsCount: any;
  totalSkillsCount: any;
  validatedSkillsCount: any;
  constructor({
    id,
    isCompleted,
    totalSkillsCount,
    testedSkillsCount,
    validatedSkillsCount,
    knowledgeElementsCount,

    // relationships
    campaignParticipationBadges,

    competenceResults = [],
    reachedStage,
    stageCount
  }: any = {}) {
    this.id = id;
    this.isCompleted = isCompleted;
    this.totalSkillsCount = totalSkillsCount;
    this.testedSkillsCount = testedSkillsCount;
    this.validatedSkillsCount = validatedSkillsCount;
    this.knowledgeElementsCount = knowledgeElementsCount;
    // relationships
    this.campaignParticipationBadges = campaignParticipationBadges;
    this.competenceResults = competenceResults;
    this.reachedStage = reachedStage;
    this.stageCount = stageCount;
  }

  static buildFrom({
    campaignParticipationId,
    assessment,
    competences,
    targetProfile,
    knowledgeElements,
    campaignBadges = [],
    acquiredBadgeIds = []
  }: any) {
    const targetProfileSkillsIds = targetProfile.getSkillIds();
    const targetedKnowledgeElements = _removeUntargetedKnowledgeElements(knowledgeElements, targetProfileSkillsIds);

    const targetedCompetenceResults = _computeCompetenceResults(
      competences,
      targetProfileSkillsIds,
      targetedKnowledgeElements
    );
    const campaignParticipationBadges = _.flatMap(campaignBadges, (badge: any) => {
      const skillSetResults = _computeSkillSetResults(badge, targetProfileSkillsIds, targetedKnowledgeElements);
      const isBadgeAcquired = _.includes(acquiredBadgeIds, badge.id);
      return CampaignParticipationBadge.buildFrom({ badge, skillSetResults, isAcquired: isBadgeAcquired });
    });

    const validatedSkillsCount = _.sumBy(targetedCompetenceResults, 'validatedSkillsCount');
    const totalSkillsCount = _.sumBy(targetedCompetenceResults, 'totalSkillsCount');
    const testedSkillsCount = _.sumBy(targetedCompetenceResults, 'testedSkillsCount');

    const stages = targetProfile.stages || null;

    return new CampaignParticipationResult({
      id: campaignParticipationId,
      totalSkillsCount,
      testedSkillsCount,
      validatedSkillsCount,
      knowledgeElementsCount: targetedKnowledgeElements.length,
      isCompleted: assessment.isCompleted(),
      competenceResults: targetedCompetenceResults,
      campaignParticipationBadges,
      reachedStage: _computeReachedStage({ stages, totalSkillsCount, validatedSkillsCount }),
      stageCount: stages && stages.length,
    });
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get masteryPercentage() {
    return _computeMasteryPercentage({
      totalSkillsCount: this.totalSkillsCount,
      validatedSkillsCount: this.validatedSkillsCount,
    });
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get progress() {
    return campaignParticipationService.progress(this.isCompleted, this.knowledgeElementsCount, this.totalSkillsCount);
  }
}

function _computeReachedStage({
  stages,
  totalSkillsCount,
  validatedSkillsCount
}: any) {
  if (!stages) {
    return null;
  }
  const masteryPercentage = _computeMasteryPercentage({ totalSkillsCount, validatedSkillsCount });
  const reachedStages = stages.filter((stage: any) => masteryPercentage >= stage.threshold);
  return {
    ..._.last(reachedStages),
    starCount: reachedStages.length,
  };
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _computeMasteryPercentage({
  totalSkillsCount,
  validatedSkillsCount
}: any) {
  if (totalSkillsCount !== 0) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    return Math.round((validatedSkillsCount * 100) / totalSkillsCount);
  } else {
    return 0;
  }
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _removeUntargetedKnowledgeElements(knowledgeElements: any, targetProfileSkillsIds: any) {
  return _.filter(knowledgeElements, (ke: any) => targetProfileSkillsIds.some((skillId: any) => skillId === ke.skillId));
}

function _computeCompetenceResults(competences: any, targetProfileSkillsIds: any, targetedKnowledgeElements: any) {
  let targetedCompetences = _removeUntargetedSkillIdsFromCompetences(competences, targetProfileSkillsIds);
  targetedCompetences = _removeCompetencesWithoutAnyTargetedSkillsLeft(targetedCompetences);
  const targetedCompetenceResults = _.map(targetedCompetences, (competence: any) => _getTestedCompetenceResults(competence, targetedKnowledgeElements)
  );
  return targetedCompetenceResults;
}

function _computeSkillSetResults(badge: any, targetProfileSkillsIds: any, targetedKnowledgeElements: any) {
  if (!badge || _.isEmpty(badge.skillSets)) {
    return [];
  }

  return _computeCompetenceResults(badge.skillSets, targetProfileSkillsIds, targetedKnowledgeElements);
}

function _removeUntargetedSkillIdsFromCompetences(competences: any, targetProfileSkillsIds: any) {
  return _.map(competences, (competence: any) => {
    competence.skillIds = _.intersection(competence.skillIds, targetProfileSkillsIds);
    return competence;
  });
}

function _removeCompetencesWithoutAnyTargetedSkillsLeft(competences: any) {
  return _.filter(competences, (competence: any) => !_.isEmpty(competence.skillIds));
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _getTestedCompetenceResults(competence: any, targetedKnowledgeElements: any) {
  const targetedKnowledgeElementsForCompetence = _.filter(targetedKnowledgeElements, (ke: any) => _.includes(competence.skillIds, ke.skillId)
  );
  const validatedKnowledgeElementsForCompetence = _.filter(targetedKnowledgeElementsForCompetence, 'isValidated');

  const testedSkillsCount = targetedKnowledgeElementsForCompetence.length;
  const validatedSkillsCount = validatedKnowledgeElementsForCompetence.length;
  const totalSkillsCount = competence.skillIds.length;
  const areaColor = competence.area ? competence.area.color : null;
  const areaName = _getAreaName(competence);

  return new CompetenceResult({
    id: competence.id,
    name: competence.name,
    index: competence.index,
    areaColor,
    areaName,
    totalSkillsCount,
    testedSkillsCount,
    validatedSkillsCount,
    badgeId: competence.badgeId,
  });
}

function _getAreaName(competence: any) {
  if (!competence.area) return;
  return competence.area.name;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipationResult;
