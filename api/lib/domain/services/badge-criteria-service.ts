// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../../../lib/domain/models/BadgeCriterion');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');

function areBadgeCriteriaFulfilled({
  knowledgeElements,
  targetProfile,
  badge
}: any) {
  const targetProfileSkillsIds = targetProfile.getSkillIds();
  const targetedKnowledgeElements = _removeUntargetedKnowledgeElements(knowledgeElements, targetProfileSkillsIds);

  const masteryPercentage = getMasteryPercentageForTargetProfile({ targetProfileSkillsIds, targetedKnowledgeElements });
  const skillSetResults = getMasteryPercentageForAllSkillSets({
    badge,
    targetProfileSkillsIds,
    targetedKnowledgeElements,
  });

  return verifyCriteriaFulfilment({ masteryPercentage, skillSetResults, badge });
}

function getMasteryPercentageForTargetProfile({
  targetProfileSkillsIds,
  targetedKnowledgeElements
}: any) {
  const validatedSkillsCount = targetedKnowledgeElements.filter(
    (targetedKnowledgeElement: any) => targetedKnowledgeElement.isValidated
  ).length;
  const totalSkillsCount = targetProfileSkillsIds.length;
  return _computeMasteryPercentage({ totalSkillsCount, validatedSkillsCount });
}

function getMasteryPercentageForAllSkillSets({
  targetedKnowledgeElements,
  targetProfileSkillsIds,
  badge
}: any) {
  if (_.isEmpty(badge.skillSets)) {
    return [];
  }

  const validTargetedSkillSets = _keepValidTargetedSkillSets(badge.skillSets, targetProfileSkillsIds);
  return _.map(validTargetedSkillSets, (skillSet: any) => _getTestedCompetenceResults(skillSet, targetedKnowledgeElements));
}

function verifyCriteriaFulfilment({
  masteryPercentage,
  skillSetResults,
  badge
}: any) {
  if (!badge.badgeCriteria.length) {
    logger.warn(`No criteria for badge ${badge.id}`);
    return false;
  }
  return _.every(badge.badgeCriteria, (criterion: any) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'SCOPES' does not exist on type 'typeof B... Remove this comment to see the full error message
    if (criterion.scope === BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION) {
      return masteryPercentage >= criterion.threshold;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'SCOPES' does not exist on type 'typeof B... Remove this comment to see the full error message
    } else if (criterion.scope === BadgeCriterion.SCOPES.SKILL_SET) {
      return _verifyListOfSkillSetResultsMasteryPercentageCriterion({
        allSkillSetResults: skillSetResults,
        threshold: criterion.threshold,
        skillSetIds: criterion.skillSetIds,
      });
    } else {
      return false;
    }
  });
}

function _verifyListOfSkillSetResultsMasteryPercentageCriterion({
  allSkillSetResults,
  threshold,
  skillSetIds
}: any) {
  const filteredSkillSetResults = _.filter(allSkillSetResults, (skillSetResult: any) => skillSetIds.includes(skillSetResult.id)
  );

  return _.every(filteredSkillSetResults, (skillSetResult: any) => skillSetResult.masteryPercentage >= threshold);
}

function _removeUntargetedKnowledgeElements(knowledgeElements: any, targetProfileSkillsIds: any) {
  return _.filter(knowledgeElements, (ke: any) => targetProfileSkillsIds.some((skillId: any) => skillId === ke.skillId));
}

function _keepValidTargetedSkillSets(skillSets: any, targetProfileSkillsIds: any) {
  const targetedCompetences = _removeUntargetedSkillIdsFromSkillSets(skillSets, targetProfileSkillsIds);
  return _removeSkillSetsWithoutAnyTargetedSkillsLeft(targetedCompetences);
}

function _removeUntargetedSkillIdsFromSkillSets(skillSets: any, targetProfileSkillsIds: any) {
  return _.map(skillSets, (skillSet: any) => {
    skillSet.skillIds = _.intersection(skillSet.skillIds, targetProfileSkillsIds);
    return skillSet;
  });
}

function _removeSkillSetsWithoutAnyTargetedSkillsLeft(skillSets: any) {
  return _.filter(skillSets, (skillSet: any) => !_.isEmpty(skillSet.skillIds));
}

function _computeMasteryPercentage({
  totalSkillsCount,
  validatedSkillsCount
}: any) {
  if (totalSkillsCount === 0) {
    return 0;
  } else {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    return Math.round((validatedSkillsCount * 100) / totalSkillsCount);
  }
}

function _getTestedCompetenceResults(skillSet: any, targetedKnowledgeElements: any) {
  const targetedKnowledgeElementsForCompetence = _.filter(targetedKnowledgeElements, (ke: any) => _.includes(skillSet.skillIds, ke.skillId)
  );
  const validatedKnowledgeElementsForCompetence = _.filter(targetedKnowledgeElementsForCompetence, 'isValidated');

  const validatedSkillsCount = validatedKnowledgeElementsForCompetence.length;
  const totalSkillsCount = skillSet.skillIds.length;

  const masteryPercentage = _computeMasteryPercentage({ totalSkillsCount, validatedSkillsCount });

  return {
    id: skillSet.id,
    masteryPercentage,
  };
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  areBadgeCriteriaFulfilled,
  verifyCriteriaFulfilment,
  getMasteryPercentageForTargetProfile,
  getMasteryPercentageForAllSkillSets,
};
