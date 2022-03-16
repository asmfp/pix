// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationChallenge = require('../models/CertificationChallenge');

const {
  MAX_CHALLENGES_PER_COMPETENCE_FOR_CERTIFICATION,
  MAX_CHALLENGES_PER_AREA_FOR_CERTIFICATION_PLUS,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_ORIGIN... Remove this comment to see the full error message
  PIX_ORIGIN,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../constants');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../models/KnowledgeElement');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Challenge'... Remove this comment to see the full error message
const Challenge = require('../models/Challenge');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'challengeR... Remove this comment to see the full error message
const challengeRepository = require('../../infrastructure/repositories/challenge-repository');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const answerRepository = require('../../infrastructure/repositories/answer-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileWithLearningContentRepository = require('../../infrastructure/repositories/target-profile-with-learning-content-repository');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certifiableProfileForLearningContentRepository = require('../../infrastructure/repositories/certifiable-profile-for-learning-content-repository');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async pickCertificationChallenges(placementProfile: any, locale: any) {
    const certifiableUserCompetences = placementProfile.getCertifiableUserCompetences();

    const alreadyAnsweredChallengeIds = await _getAlreadyAnsweredChallengeIds(
      knowledgeElementRepository,
      answerRepository,
      placementProfile.userId,
      placementProfile.profileDate
    );

    const allOperativeChallengesForLocale = await challengeRepository.findOperativeHavingLocale(locale);

    return _pickCertificationChallengesForCertifiableCompetences(
      certifiableUserCompetences,
      alreadyAnsweredChallengeIds,
      allOperativeChallengesForLocale
    );
  },

  async pickCertificationChallengesForPixPlus(certifiableBadge: any, userId: any, locale: any) {
    const targetProfileWithLearningContent = await targetProfileWithLearningContentRepository.get({
      id: certifiableBadge.targetProfileId,
    });
    const certifiableProfile = await certifiableProfileForLearningContentRepository.get({
      id: userId,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      profileDate: new Date(),
      targetProfileWithLearningContent,
    });

    const excludedOrigins = [PIX_ORIGIN];
    const skillIdsByArea = certifiableProfile.getOrderedCertifiableSkillsByAreaId(excludedOrigins);

    const alreadyAnsweredChallengeIds = certifiableProfile.getAlreadyAnsweredChallengeIds();

    const allOperativeChallengesForLocale = await challengeRepository.findOperativeHavingLocale(locale);
    return _pickCertificationChallengesForAllAreas(
      skillIdsByArea,
      alreadyAnsweredChallengeIds,
      allOperativeChallengesForLocale,
      targetProfileWithLearningContent,
      certifiableBadge.key
    );
  },
};

async function _getAlreadyAnsweredChallengeIds(knowledgeElementRepository: any, answerRepository: any, userId: any, limitDate: any) {
  const knowledgeElementsByCompetence = await knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId({
    userId,
    limitDate,
  });
  const knowledgeElements = KnowledgeElement.findDirectlyValidatedFromGroups(knowledgeElementsByCompetence);
  const answerIds = _.map(knowledgeElements, 'answerId');

  return answerRepository.findChallengeIdsFromAnswerIds(answerIds);
}

function _pickCertificationChallengesForCertifiableCompetences(
  certifiableUserCompetences: any,
  alreadyAnsweredChallengeIds: any,
  allChallenges: any
) {
  let pickedCertificationChallenges: any = [];
  for (const userCompetence of certifiableUserCompetences) {
    const certificationChallengesForCompetence = _pick3CertificationChallengesForCompetence(
      userCompetence,
      alreadyAnsweredChallengeIds,
      allChallenges
    );
    pickedCertificationChallenges = pickedCertificationChallenges.concat(certificationChallengesForCompetence);
  }
  return pickedCertificationChallenges;
}

function _getTubeName(certificationChallengeInResult: any) {
  return certificationChallengeInResult.associatedSkillName.slice(0, -1);
}

function _pick3CertificationChallengesForCompetence(userCompetence: any, alreadyAnsweredChallengeIds: any, allChallenges: any) {
  const result: any = [];

  const groupedByDifficultySkills = _(userCompetence.getSkillsAtLatestVersion())
    .orderBy('difficulty', 'desc')
    .groupBy('difficulty')
    .value();

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  const groupedByDescDifficultySkills = _.reverse(Object.keys(groupedByDifficultySkills).sort());
  for (const difficulty of groupedByDescDifficultySkills) {
    const skills = groupedByDifficultySkills[difficulty];
    const certificationChallengesForDifficulty = [];
    for (const skill of skills) {
      const challenge = _pickChallengeForSkill({
        skill,
        allChallenges,
        alreadyAnsweredChallengeIds,
      });

      if (challenge) {
        const certificationChallenge = CertificationChallenge.createForPixCertification({
          challengeId: challenge.id,
          competenceId: userCompetence.id,
          associatedSkillName: skill.name,
          associatedSkillId: skill.id,
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
        certificationChallengesForDifficulty.push(certificationChallenge);
      }
    }

    const [certificationChallengesWithTubeAlreadyAdded, certificationChallengesWithTubeNotAlreadyAdded] = _.partition(
      certificationChallengesForDifficulty,
      (certificationChallenge: any) => result.some(
        (certificationChallengeInResult: any) => _getTubeName(certificationChallenge) === _getTubeName(certificationChallengeInResult)
      )
    );

    result.push(...certificationChallengesWithTubeNotAlreadyAdded, ...certificationChallengesWithTubeAlreadyAdded);

    if (_haveEnoughCertificationChallenges(result, MAX_CHALLENGES_PER_COMPETENCE_FOR_CERTIFICATION)) {
      break;
    }
  }
  return _keepOnly3Challenges(result);
}

function _pickCertificationChallengesForAllAreas(
  skillIdsByArea: any,
  alreadyAnsweredChallengeIds: any,
  allChallenges: any,
  targetProfileWithLearningContent: any,
  certifiableBadgeKey: any
) {
  let pickedCertificationChallenges: any = [];
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  for (const skillIds of Object.values(skillIdsByArea)) {
    const certificationChallengesForArea = _pick4CertificationChallengesForArea(
      skillIds,
      alreadyAnsweredChallengeIds,
      allChallenges,
      targetProfileWithLearningContent,
      certifiableBadgeKey
    );
    pickedCertificationChallenges = pickedCertificationChallenges.concat(certificationChallengesForArea);
  }

  return pickedCertificationChallenges;
}

function _pick4CertificationChallengesForArea(
  skillIds: any,
  alreadyAnsweredChallengeIds: any,
  allChallenges: any,
  targetProfileWithLearningContent: any,
  certifiableBadgeKey: any
) {
  const result = [];

  for (const skillId of skillIds) {
    if (_haveEnoughCertificationChallenges(result, MAX_CHALLENGES_PER_AREA_FOR_CERTIFICATION_PLUS)) {
      break;
    }

    const skill = targetProfileWithLearningContent.findSkill(skillId);
    const competenceId = targetProfileWithLearningContent.getCompetenceIdOfSkill(skillId);

    const challenge = _pickChallengeForSkill({
      skill,
      allChallenges,
      alreadyAnsweredChallengeIds,
    });
    if (challenge) {
      const certificationChallenge = CertificationChallenge.createForPixPlusCertification({
        challengeId: challenge.id,
        competenceId,
        associatedSkillName: skill.name,
        associatedSkillId: skill.id,
        certifiableBadgeKey,
      });

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
      result.push(certificationChallenge);
    }
  }

  return result;
}

function _haveEnoughCertificationChallenges(certificationChallenges: any, limitCount: any) {
  return certificationChallenges.length >= limitCount;
}

function _keepOnly3Challenges(result: any) {
  return result.slice(0, MAX_CHALLENGES_PER_COMPETENCE_FOR_CERTIFICATION);
}

function _pickChallengeForSkill({
  skill,
  allChallenges,
  alreadyAnsweredChallengeIds
}: any) {
  const challengesToValidateCurrentSkill = Challenge.findBySkill({ challenges: allChallenges, skill });
  const unansweredChallenges = _.filter(
    challengesToValidateCurrentSkill,
    (challenge: any) => !alreadyAnsweredChallengeIds.includes(challenge.id)
  );

  const challengesPoolToPickChallengeFrom = _.isEmpty(unansweredChallenges)
    ? challengesToValidateCurrentSkill
    : unansweredChallenges;
  if (_.isEmpty(challengesPoolToPickChallengeFrom)) {
    return;
  }
  const challenge = _.sample(challengesPoolToPickChallengeFrom);

  return challenge;
}
