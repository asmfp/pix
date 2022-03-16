// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Thematic'.
const Thematic = require('../../domain/models/Thematic');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const thematicDatasource = require('../datasources/learning-content/thematic-datasource');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(thematicData: any) {
  return new Thematic({
    id: thematicData.id,
    name: thematicData.name,
    index: thematicData.index,
    tubeIds: thematicData.tubeIds,
  });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async list() {
    const thematicData = await thematicDatasource.list();
    return thematicData.map(_toDomain);
  },
};
