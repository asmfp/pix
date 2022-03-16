// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
const Scorecard = require('../models/Scorecard');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../models/KnowledgeElement');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findTutorials({
  authenticatedUserId,
  scorecardId,
  knowledgeElementRepository,
  skillRepository,
  tubeRepository,
  tutorialRepository,
  locale
}: any) {
  const { userId, competenceId } = Scorecard.parseId(scorecardId);

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
  if (parseInt(authenticatedUserId) !== parseInt(userId)) {
    throw new UserNotAuthorizedToAccessEntityError();
  }

  const knowledgeElements = await knowledgeElementRepository.findUniqByUserIdAndCompetenceId({ userId, competenceId });
  const invalidatedDirectKnowledgeElements = _getInvalidatedDirectKnowledgeElements(knowledgeElements);

  if (invalidatedDirectKnowledgeElements.length === 0) {
    return [];
  }
  const skills = await skillRepository.findActiveByCompetenceId(competenceId);
  const failedSkills = _getFailedSkills(skills, invalidatedDirectKnowledgeElements);

  const skillsGroupedByTube = _getSkillsGroupedByTube(failedSkills);
  const easiestSkills = _getEasiestSkills(skillsGroupedByTube);

  const tubeNamesForTutorials = _.keys(skillsGroupedByTube);
  const tubes = await tubeRepository.findByNames({ tubeNames: tubeNamesForTutorials, locale });

  const tutorialsWithTubesList = await _getTutorialsWithTubesList(
    easiestSkills,
    tubes,
    tutorialRepository,
    userId,
    locale
  );
  return _.orderBy(_.flatten(tutorialsWithTubesList), 'tubeName');
};

async function _getTutorialsWithTubesList(easiestSkills: any, tubes: any, tutorialRepository: any, userId: any, locale: any) {
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  return await Promise.all(
    _.map(easiestSkills, async (skill: any) => {
      const tube = _.find(tubes, { name: skill.tubeName });
      const tutorials = await tutorialRepository.findByRecordIdsForCurrentUser({
        ids: skill.tutorialIds,
        userId,
        locale,
      });
      return _.map(tutorials, (tutorial: any) => {
        tutorial.tubeName = tube.name;
        tutorial.tubePracticalTitle = tube.practicalTitle;
        tutorial.tubePracticalDescription = tube.practicalDescription;
        return tutorial;
      });
    })
  );
}

function _getEasiestSkills(skillsGroupByTube: any) {
  return _.map(skillsGroupByTube, _.head);
}

function _getSkillsGroupedByTube(failedSkills: any) {
  return _.groupBy(_(_.orderBy(failedSkills, 'difficulty')).uniq().value(), 'tubeName');
}

function _getFailedSkills(skills: any, invalidatedDirectKnowledgeElements: any) {
  return _.filter(skills, (skill: any) => _.includes(_.map(invalidatedDirectKnowledgeElements, 'skillId'), skill.id));
}

function _getInvalidatedDirectKnowledgeElements(knowledgeElements: any) {
  return _.filter(
    knowledgeElements,
    (knowledgeElement: any) => knowledgeElement.isInvalidated && knowledgeElement.source === KnowledgeElement.SourceType.DIRECT
  );
}
