// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Area'.
const Area = require('../../domain/models/Area');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'areaDataso... Remove this comment to see the full error message
const areaDatasource = require('../datasources/learning-content/area-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('./competence-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

async function list() {
  const areaDataObjects = await areaDatasource.list();
  return areaDataObjects.map((areaDataObject: any) => {
    return new Area({
      id: areaDataObject.id,
      code: areaDataObject.code,
      name: areaDataObject.name,
      title: areaDataObject.titleFrFr,
      color: areaDataObject.color,
    });
  });
}

async function listWithPixCompetencesOnly({
  locale
}: any = {}) {
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  const [areas, competences] = await Promise.all([list(), competenceRepository.listPixCompetencesOnly({ locale })]);
  areas.forEach((area: any) => {
    area.competences = _.filter(competences, { area: { id: area.id } });
  });
  return _.filter(areas, ({
    competences
  }: any) => !_.isEmpty(competences));
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  list,
  listWithPixCompetencesOnly,
};
