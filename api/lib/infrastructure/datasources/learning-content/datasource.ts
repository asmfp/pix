// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../lcms');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LearningCo... Remove this comment to see the full error message
const LearningContentResourceNotFound = require('./LearningContentResourceNotFound');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cache'.
const cache = require('../../caches/learning-content-cache');

const _DatasourcePrototype = {
  async get(id: any) {
    const modelObjects = await this.list();
    const foundObject = _.find(modelObjects, { id });

    if (!foundObject) {
      throw new LearningContentResourceNotFound();
    }

    return foundObject;
  },

  async getMany(ids: any) {
    const modelObjects = await this.list();

    return ids.map((id: any) => {
      const foundObject = _.find(modelObjects, { id });

      if (!foundObject) {
        throw new LearningContentResourceNotFound();
      }

      return foundObject;
    });
  },

  async list() {
    const learningContent = await this._getLearningContent();
    return learningContent[this.modelName];
  },

  async _getLearningContent() {
    const generator = () => lcms.getLatestRelease();
    const learningContent = await cache.get(generator);
    return learningContent;
  },

  async refreshLearningContentCacheRecord(id: any, newEntry: any) {
    const currentLearningContent = await this._getLearningContent();
    const currentRecords = currentLearningContent[this.modelName];
    const updatedRecords = _.reject(currentRecords, { id }).concat([newEntry]);
    const newLearningContent = _.cloneDeep(currentLearningContent);
    newLearningContent[this.modelName] = updatedRecords;
    await cache.set(newLearningContent);
    return newEntry;
  },
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  extend(props: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    const result = Object.assign({}, _DatasourcePrototype, props);
    _.bindAll(result, _.functions(result));
    return result;
  },

  async refreshLearningContentCacheRecords() {
    const learningContent = await lcms.getLatestRelease();
    await cache.set(learningContent);
    return learningContent;
  },
};
