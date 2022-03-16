// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'datasource... Remove this comment to see the full error message
const datasource = require('./datasource');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = datasource.extend({
  modelName: 'tubes',

  async findByNames(tubeNames: any) {
    const tubes = await this.list();
    return tubes.filter((tubeData: any) => _.includes(tubeNames, tubeData.name));
  },

  async findByRecordIds(tubeIds: any) {
    const tubes = await this.list();
    return tubes.filter(({
      id
    }: any) => tubeIds.includes(id));
  },
});
