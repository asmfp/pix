// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserCompet... Remove this comment to see the full error message
const UserCompetence = require('../models/UserCompetence');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PlacementP... Remove this comment to see the full error message
const PlacementProfile = require('../models/PlacementProfile');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('../../infrastructure/repositories/assessment-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillRepos... Remove this comment to see the full error message
const skillRepository = require('../../infrastructure/repositories/skill-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentResultRepository = require('../../infrastructure/repositories/assessment-result-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('../../infrastructure/repositories/competence-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'scoringSer... Remove this comment to see the full error message
const scoringService = require('./scoring/scoring-service');

async function getPlacementProfile({
  userId,
  limitDate,
  isV2Certification = true,
  allowExcessPixAndLevels = true,
  locale
}: any) {
  const pixCompetences = await competenceRepository.listPixCompetencesOnly({ locale });
  if (isV2Certification) {
    return _generatePlacementProfileV2({
      userId,
      profileDate: limitDate,
      competences: pixCompetences,
      allowExcessPixAndLevels,
    });
  }
  return _generatePlacementProfileV1({ userId, profileDate: limitDate, competences: pixCompetences });
}

async function _createUserCompetencesV1({
  competences,
  userLastAssessments,
  limitDate
}: any) {
  return bluebird.mapSeries(competences, async (competence: any) => {
    const assessment = _.find(userLastAssessments, { competenceId: competence.id });
    let estimatedLevel = 0;
    let pixScore = 0;
    if (assessment) {
      const assessmentResultLevelAndPixScore =
        await assessmentResultRepository.findLatestLevelAndPixScoreByAssessmentId({
          assessmentId: assessment.id,
          limitDate,
        });
      estimatedLevel = assessmentResultLevelAndPixScore.level;
      pixScore = assessmentResultLevelAndPixScore.pixScore;
    }
    return new UserCompetence({
      id: competence.id,
      area: competence.area,
      index: competence.index,
      name: competence.name,
      estimatedLevel,
      pixScore,
    });
  });
}

async function _generatePlacementProfileV1({
  userId,
  profileDate,
  competences
}: any) {
  const placementProfile = new PlacementProfile({
    userId,
    profileDate,
  });
  const userLastAssessments = await assessmentRepository.findLastCompletedAssessmentsForEachCompetenceByUser(
    placementProfile.userId,
    placementProfile.profileDate
  );
  placementProfile.userCompetences = await _createUserCompetencesV1({
    competences,
    userLastAssessments,
    limitDate: placementProfile.profileDate,
  });

  return placementProfile;
}

function _createUserCompetencesV2({
  knowledgeElementsByCompetence,
  competences,
  allowExcessPixAndLevels = true,
  skills = []
}: any) {
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
  const skillMap = new Map(skills.map((skill: any) => [skill.id, skill]));

  return competences.map((competence: any) => {
    const knowledgeElementsForCompetence = knowledgeElementsByCompetence[competence.id] || [];

    const { pixScoreForCompetence, currentLevel } = scoringService.calculateScoringInformationForCompetence({
      knowledgeElements: knowledgeElementsForCompetence,
      allowExcessPix: allowExcessPixAndLevels,
      allowExcessLevel: allowExcessPixAndLevels,
    });

    const directlyValidatedCompetenceSkills = _matchingDirectlyValidatedSkillsForCompetence(
      knowledgeElementsForCompetence,
      skillMap
    );

    return new UserCompetence({
      id: competence.id,
      area: competence.area,
      index: competence.index,
      name: competence.name,
      estimatedLevel: currentLevel,
      pixScore: pixScoreForCompetence,
      skills: directlyValidatedCompetenceSkills,
    });
  });
}

async function _generatePlacementProfileV2({
  userId,
  profileDate,
  competences,
  allowExcessPixAndLevels
}: any) {
  const placementProfile = new PlacementProfile({
    userId,
    profileDate,
  });

  const knowledgeElementsByCompetence = await knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId({
    userId: placementProfile.userId,
    limitDate: placementProfile.profileDate,
  });

  const skills = await skillRepository.list();

  placementProfile.userCompetences = _createUserCompetencesV2({
    knowledgeElementsByCompetence,
    competences,
    allowExcessPixAndLevels,
    skills,
  });

  return placementProfile;
}

async function getPlacementProfilesWithSnapshotting({
  userIdsAndDates,
  competences,
  allowExcessPixAndLevels = true
}: any) {
  const knowledgeElementsByUserIdAndCompetenceId =
    await knowledgeElementRepository.findSnapshotGroupedByCompetencesForUsers(userIdsAndDates);

  const placementProfilesList = [];
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  for (const [strUserId, knowledgeElementsByCompetence] of Object.entries(knowledgeElementsByUserIdAndCompetenceId)) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    const userId = parseInt(strUserId);
    const placementProfile = new PlacementProfile({
      userId,
      profileDate: userIdsAndDates[userId],
    });

    placementProfile.userCompetences = _createUserCompetencesV2({
      knowledgeElementsByCompetence,
      competences,
      allowExcessPixAndLevels,
    });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
    placementProfilesList.push(placementProfile);
  }

  return placementProfilesList;
}

function _matchingDirectlyValidatedSkillsForCompetence(knowledgeElementsForCompetence: any, skillMap: any) {
  const competenceSkills = knowledgeElementsForCompetence
    .filter((ke: any) => ke.isDirectlyValidated())
    .map((ke: any) => {
      return skillMap.get(ke.skillId);
    });

  return _.compact(competenceSkills);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getPlacementProfile,
  getPlacementProfilesWithSnapshotting,
};
