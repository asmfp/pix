// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'datasource... Remove this comment to see the full error message
const datasource = require('./datasource');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = datasource.extend({
  modelName: 'tutorials',

  async findByRecordIds(tutorialRecordIds: any) {
    const tutorials = await this.list();
    return tutorials.filter((tutorialData: any) => _.includes(tutorialRecordIds, tutorialData.id));
  },
});
