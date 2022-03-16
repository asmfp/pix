// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Tube'.
const Tube = require('../../domain/models/Tube');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tubeDataso... Remove this comment to see the full error message
const tubeDatasource = require('../datasources/learning-content/tube-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('./competence-repository');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getTransla... Remove this comment to see the full error message
const { getTranslatedText } = require('../../domain/services/get-translated-text');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain({
  tubeData,
  locale
}: any) {
  const translatedPracticalTitle = getTranslatedText(locale, {
    frenchText: tubeData.practicalTitleFrFr,
    englishText: tubeData.practicalTitleEnUs,
  });
  const translatedPracticalDescription = getTranslatedText(locale, {
    frenchText: tubeData.practicalDescriptionFrFr,
    englishText: tubeData.practicalDescriptionEnUs,
  });

  return new Tube({
    id: tubeData.id,
    name: tubeData.name,
    title: tubeData.title,
    description: tubeData.description,
    practicalTitle: translatedPracticalTitle,
    practicalDescription: translatedPracticalDescription,
    competenceId: tubeData.competenceId,
  });
}

function _findFromPixFramework(tubeDatas: any, pixCompetences: any) {
  return pixCompetences.flatMap(({
    id
  }: any) => {
    return tubeDatas.filter(({
      competenceId
    }: any) => id === competenceId);
  });
}

async function _findActive(tubesFromPixFramework: any) {
  const skillsByTube = await bluebird.mapSeries(tubesFromPixFramework, ({
    id
  }: any) =>
    skillDatasource.findActiveByTubeId(id)
  );

  const activeTubes = skillsByTube.reduce((accumulator: any, activeSkills: any) => {
    if (activeSkills.length > 0) {
      const tube = tubesFromPixFramework.find((tubeFromPixFramework: any) => {
        return tubeFromPixFramework.id === activeSkills[0].tubeId;
      });
      accumulator.push(tube);
    }
    return accumulator;
  }, []);
  return activeTubes;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: any) {
    const tubeData = await tubeDatasource.get(id);
    return _toDomain({ tubeData });
  },

  async list() {
    const tubeDatas = await tubeDatasource.list();
    const tubes = _.map(tubeDatas, (tubeData: any) => _toDomain({ tubeData }));
    return _.orderBy(tubes, (tube: any) => tube.name.toLowerCase());
  },

  async findByNames({
    tubeNames,
    locale
  }: any) {
    const tubeDatas = await tubeDatasource.findByNames(tubeNames);
    const tubes = _.map(tubeDatas, (tubeData: any) => _toDomain({ tubeData, locale }));
    return _.orderBy(tubes, (tube: any) => tube.name.toLowerCase());
  },

  async findActivesFromPixFramework(locale: any) {
    const tubeDatas = await tubeDatasource.list();
    const pixCompetences = await competenceRepository.listPixCompetencesOnly();

    const tubesFromPixFramework = _findFromPixFramework(tubeDatas, pixCompetences);

    const activeTubes = await _findActive(tubesFromPixFramework);

    const tubes = _.map(activeTubes, (tubeData: any) => _toDomain({ tubeData, locale }));
    return _.orderBy(tubes, (tube: any) => tube.name.toLowerCase());
  },
};
