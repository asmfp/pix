// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Tutorial'.
const Tutorial = require('../../domain/models/Tutorial');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'userTutori... Remove this comment to see the full error message
const userTutorialRepository = require('./user-tutorial-repository');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const tutorialEvaluationRepository = require('./tutorial-evaluation-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tutorialDa... Remove this comment to see the full error message
const tutorialDatasource = require('../datasources/learning-content/tutorial-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TutorialWi... Remove this comment to see the full error message
const TutorialWithUserSavedTutorial = require('../../domain/models/TutorialWithUserSavedTutorial');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'FRENCH_FRA... Remove this comment to see the full error message
const { FRENCH_FRANCE } = require('../../domain/constants').LOCALE;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillRepos... Remove this comment to see the full error message
const skillRepository = require('./skill-repository');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findByRecordIdsForCurrentUser({
    ids,
    userId,
    locale
  }: any) {
    const tutorials = await _findByRecordIds({ ids, locale });
    const userSavedTutorials = await userTutorialRepository.find({ userId });
    const tutorialEvaluations = await tutorialEvaluationRepository.find({ userId });
    _.forEach(tutorials, _assignUserInformation(userSavedTutorials, tutorialEvaluations));
    return tutorials;
  },

  async findByRecordIds(ids: any) {
    return _findByRecordIds({ ids });
  },

  async findPaginatedWithUserTutorialForCurrentUser({
    userId,
    page
  }: any) {
    const { models: userTutorials, meta } = await userTutorialRepository.findPaginated({ userId, page });
    const tutorials = await tutorialDatasource.findByRecordIds(userTutorials.map(({
      tutorialId
    }: any) => tutorialId));

    const tutorialsWithUserSavedTutorial = tutorials.map((tutorial: any) => {
      const userTutorial = userTutorials.find(({
        tutorialId
      }: any) => tutorialId === tutorial.id);
      return new TutorialWithUserSavedTutorial({ ...tutorial, userTutorial });
    });

    return { models: tutorialsWithUserSavedTutorial, meta };
  },

  async get(id: any) {
    try {
      const tutorialData = await tutorialDatasource.get(id);
      return _toDomain(tutorialData);
    } catch (error) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError('Tutorial not found');
    }
  },

  async list({ locale = FRENCH_FRANCE }) {
    let tutorialData = await tutorialDatasource.list();
    const lang = _extractLangFromLocale(locale);
    tutorialData = tutorialData.filter((tutorial: any) => _extractLangFromLocale(tutorial.locale) === lang);
    return _.map(tutorialData, _toDomain);
  },

  async findRecommendedByUserId({
    userId,
    locale = FRENCH_FRANCE
  }: any = {}) {
    const invalidatedKnowledgeElements = await knowledgeElementRepository.findInvalidatedAndDirectByUserId(userId);
    const skills = await skillRepository.findOperativeByIds(invalidatedKnowledgeElements.map(({
      skillId
    }: any) => skillId));

    const tutorialsIds = skills.flatMap((skill: any) => skill.tutorialIds);

    return _findByRecordIds({ ids: tutorialsIds, locale });
  },
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(tutorialData: any) {
  return new Tutorial({
    id: tutorialData.id,
    duration: tutorialData.duration,
    format: tutorialData.format,
    link: tutorialData.link,
    source: tutorialData.source,
    title: tutorialData.title,
  });
}

async function _findByRecordIds({
  ids,
  locale
}: any) {
  let tutorialData = await tutorialDatasource.findByRecordIds(ids);
  if (locale) {
    const lang = _extractLangFromLocale(locale);
    tutorialData = tutorialData.filter((tutorial: any) => _extractLangFromLocale(tutorial.locale) === lang);
  }
  return _.map(tutorialData, (tutorialData: any) => _toDomain(tutorialData));
}

function _extractLangFromLocale(locale: any) {
  return locale && locale.split('-')[0];
}

function _getUserSavedTutorial(userSavedTutorials: any, tutorial: any) {
  return _.find(userSavedTutorials, (userSavedTutorial: any) => userSavedTutorial.tutorialId === tutorial.id);
}

function _getTutorialEvaluation(tutorialEvaluations: any, tutorial: any) {
  return _.find(tutorialEvaluations, (tutorialEvaluation: any) => tutorialEvaluation.tutorialId === tutorial.id);
}

function _assignUserInformation(userSavedTutorials: any, tutorialEvaluations: any) {
  return (tutorial: any) => {
    const userSavedTutorial = _getUserSavedTutorial(userSavedTutorials, tutorial);
    if (userSavedTutorial) {
      tutorial.userTutorial = userSavedTutorial;
    }
    const tutorialEvaluation = _getTutorialEvaluation(tutorialEvaluations, tutorial);
    if (tutorialEvaluation) {
      tutorial.tutorialEvaluation = tutorialEvaluation;
    }
  };
}
