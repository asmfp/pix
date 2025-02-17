const Bookshelf = require('../bookshelf');

require('./TargetProfile');

const modelName = 'TargetProfileSkill';

module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'target-profiles_skills',

    targetProfile() {
      return this.belongsTo('TargetProfile', 'targetProfileId');
    },
  },
  {
    modelName,
  }
);
