// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Answer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./User');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./KnowledgeElement');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./CampaignParticipation');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'Assessment';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'assessments',
    hasTimestamps: ['createdAt', 'updatedAt'],

    answers() {
      return this.hasMany('Answer', 'assessmentId');
    },

    knowledgeElements() {
      return this.hasMany('KnowledgeElement', 'assessmentId');
    },

    campaignParticipation() {
      return this.belongsTo('CampaignParticipation', 'campaignParticipationId');
    },
  },
  {
    modelName,
  }
);
