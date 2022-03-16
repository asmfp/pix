// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Correction... Remove this comment to see the full error message
const Correction = require('../../domain/models/Correction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Hint'.
const Hint = require('../../domain/models/Hint');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'challengeD... Remove this comment to see the full error message
const challengeDatasource = require('../datasources/learning-content/challenge-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const tutorialRepository = require('./tutorial-repository');
const VALIDATED_HINT_STATUSES = ['Validé', 'pré-validé'];
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getTransla... Remove this comment to see the full error message
const { getTranslatedText } = require('../../domain/services/get-translated-text');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getByChallengeId({
    challengeId,
    userId,
    locale
  }: any) {
    const challenge = await challengeDatasource.get(challengeId);
    const skill = await _getSkill(challenge);
    const hint = await _getHint({ skill, locale });

    const tutorials = await _getTutorials({ userId, skill, tutorialIdsProperty: 'tutorialIds', locale });
    const learningMoreTutorials = await _getTutorials({
      userId,
      skill,
      tutorialIdsProperty: 'learningMoreTutorialIds',
      locale,
    });

    return new Correction({
      id: challenge.id,
      solution: challenge.solution,
      solutionToDisplay: challenge.solutionToDisplay,
      hint,
      tutorials,
      learningMoreTutorials: learningMoreTutorials,
    });
  },
};

async function _getHint({
  skill,
  locale
}: any) {
  if (_hasValidatedHint(skill)) {
    return _convertSkillToHint({ skill, locale });
  }
}

function _getSkill(challengeDataObject: any) {
  return skillDatasource.get(challengeDataObject.skillId);
}

function _hasValidatedHint(skillDataObject: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
  return VALIDATED_HINT_STATUSES.includes(skillDataObject.hintStatus);
}

function _convertSkillToHint({
  skill,
  locale
}: any) {
  return new Hint({
    skillName: skill.name,
    value: getTranslatedText(locale, { frenchText: skill.hintFrFr, englishText: skill.hintEnUs }),
  });
}

async function _getTutorials({
  userId,
  skill,
  tutorialIdsProperty,
  locale
}: any) {
  const tutorialIds = skill[tutorialIdsProperty];
  if (!_.isEmpty(tutorialIds)) {
    return tutorialRepository.findByRecordIdsForCurrentUser({ ids: tutorialIds, userId, locale });
  }
  return [];
}
