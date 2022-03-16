// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Badge');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Stage');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./TargetProfileSkill');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Organization');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'TargetProfile';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'target-profiles',
    hasTimestamps: ['createdAt', null],

    skillIds() {
      return this.hasMany('TargetProfileSkill', 'targetProfileId');
    },

    badges() {
      return this.hasMany('Badge', 'targetProfileId');
    },

    stages() {
      return this.hasMany('Stage', 'targetProfileId');
    },

    organizations() {
      return this.belongsToMany('Organization', 'target-profile-shares', 'targetProfileId', 'organizationId');
    },
  },
  {
    modelName,
  }
);
