// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Assessment');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Campaign');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./User');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'CampaignParticipation';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'campaign-participations',
    hasTimestamps: ['createdAt', null],

    assessments() {
      return this.hasMany('Assessment', 'campaignParticipationId');
    },

    campaign() {
      return this.belongsTo('Campaign', 'campaignId');
    },

    user() {
      return this.belongsTo('User', 'userId');
    },

    parse(rawAttributes: any) {
      if (rawAttributes && rawAttributes.sharedAt) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
        rawAttributes.sharedAt = new Date(rawAttributes.sharedAt);
      }

      return rawAttributes;
    },
  },
  {
    modelName,
  }
);
