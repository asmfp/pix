// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const areaRepository = require('./area-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceTree = require('../../domain/models/CompetenceTree');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  get() {
    return areaRepository.listWithPixCompetencesOnly().then((areas: any) => new CompetenceTree({ areas }));
  },
};
