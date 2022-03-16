// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../domain/models/Skill');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  fromDatasourceObject(datasourceObject: any) {
    return new Skill({
      id: datasourceObject.id,
      name: datasourceObject.name,
      pixValue: datasourceObject.pixValue,
      competenceId: datasourceObject.competenceId,
      tutorialIds: datasourceObject.tutorialIds,
      tubeId: datasourceObject.tubeId,
      version: datasourceObject.version,
    });
  },
};
