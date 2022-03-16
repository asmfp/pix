// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const LearningContentDatasources = require('../../infrastructure/datasources/learning-content');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const learningContentDatasource = require('../../infrastructure/datasources/learning-content/datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  refreshCacheEntries(request: any, h: any) {
    learningContentDatasource
      .refreshLearningContentCacheRecords()
      .catch((e: any) => logger.error('Error while reloading cache', e));
    return h.response({}).code(202);
  },

  refreshCacheEntry(request: any) {
    const updatedRecord = request.payload;
    const recordId = request.params.id;
    const datasource =
      LearningContentDatasources[_.findKey(LearningContentDatasources, { modelName: request.params.model })];
    // @ts-expect-error ts-migrate(7011) FIXME: Function expression, which lacks return-type annot... Remove this comment to see the full error message
    return datasource.refreshLearningContentCacheRecord(recordId, updatedRecord).then(() => null);
  },
};
