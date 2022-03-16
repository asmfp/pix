// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LearningCo... Remove this comment to see the full error message
const LearningContentResourceNotFound = require('../datasources/learning-content/LearningContentResourceNotFound');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Area'.
const Area = require('../../domain/models/Area');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'areaDataso... Remove this comment to see the full error message
const areaDatasource = require('../datasources/learning-content/area-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const Competence = require('../../domain/models/Competence');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceDatasource = require('../datasources/learning-content/competence-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'scoringSer... Remove this comment to see the full error message
const scoringService = require('../../domain/services/scoring/scoring-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'FRENCH_FRA... Remove this comment to see the full error message
const { FRENCH_FRANCE } = require('../../domain/constants').LOCALE;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_ORIGIN... Remove this comment to see the full error message
const { PIX_ORIGIN } = require('../../domain/constants');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getTransla... Remove this comment to see the full error message
const { getTranslatedText } = require('../../domain/services/get-translated-text');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain({
  competenceData,
  areaDatas,
  locale
}: any) {
  const areaData = competenceData.areaId && _.find(areaDatas, { id: competenceData.areaId });
  const translatedCompetenceName = getTranslatedText(locale, {
    frenchText: competenceData.nameFrFr,
    englishText: competenceData.nameEnUs,
  });
  const translatedCompetenceDescription = getTranslatedText(locale, {
    frenchText: competenceData.descriptionFrFr,
    englishText: competenceData.descriptionEnUs,
  });
  const translatedAreaTitle = areaData
    ? getTranslatedText(locale, { frenchText: areaData.titleFrFr, englishText: areaData.titleEnUs })
    : '';

  return new Competence({
    id: competenceData.id,
    name: translatedCompetenceName,
    index: competenceData.index,
    description: translatedCompetenceDescription,
    origin: competenceData.origin,
    skillIds: competenceData.skillIds,
    thematicIds: competenceData.thematicIds,
    area:
      areaData &&
      new Area({
        id: areaData.id,
        code: areaData.code,
        title: translatedAreaTitle,
        name: areaData.name,
        color: areaData.color,
      }),
  });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  list({ locale } = { locale: FRENCH_FRANCE }) {
    return _list({ locale: locale || FRENCH_FRANCE });
  },

  listPixCompetencesOnly({ locale } = { locale: FRENCH_FRANCE }) {
    return _list({ locale }).then((competences: any) => competences.filter((competence: any) => competence.origin === PIX_ORIGIN)
    );
  },

  async get({
    id,
    locale
  }: any) {
    try {
      // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
      const [competenceData, areaDatas] = await Promise.all([competenceDatasource.get(id), areaDatasource.list()]);
      return _toDomain({ competenceData, areaDatas, locale });
    } catch (err) {
      if (err instanceof LearningContentResourceNotFound) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        throw new NotFoundError('La compétence demandée n’existe pas');
      }
      throw err;
    }
  },

  async getCompetenceName({
    id,
    locale
  }: any) {
    try {
      const competence = await competenceDatasource.get(id);
      return getTranslatedText(locale, { frenchText: competence.nameFrFr, englishText: competence.nameEnUs });
    } catch (err) {
      if (err instanceof LearningContentResourceNotFound) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        throw new NotFoundError('La compétence demandée n’existe pas');
      }
      throw err;
    }
  },

  async getPixScoreByCompetence({
    userId,
    limitDate
  }: any) {
    const knowledgeElementsGroupedByCompetenceId =
      await knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId({
        userId,
        limitDate,
      });

    return _.mapValues(knowledgeElementsGroupedByCompetenceId, (knowledgeElements: any) => {
      const { pixScoreForCompetence } = scoringService.calculateScoringInformationForCompetence({ knowledgeElements });
      return pixScoreForCompetence;
    });
  },
};

function _list({
  locale
}: any) {
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  return Promise.all([competenceDatasource.list(), areaDatasource.list()]).then(([competenceDatas, areaDatas]) => {
    return _.sortBy(
      competenceDatas.map((competenceData: any) => _toDomain({ competenceData, areaDatas, locale })),
      'index'
    );
  });
}
