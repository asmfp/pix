// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Assessment');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./CampaignParticipation');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Organization');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./TargetProfile');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./User');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'Campaign';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'campaigns',
    hasTimestamps: ['createdAt', null],

    organization() {
      return this.belongsTo('Organization', 'organizationId');
    },

    campaignParticipations() {
      return this.hasMany('CampaignParticipation', 'campaignId');
    },

    targetProfile() {
      return this.belongsTo('TargetProfile', 'targetProfileId');
    },

    creator() {
      return this.belongsTo('User', 'creatorId');
    },
  },
  {
    modelName,
  }
);
