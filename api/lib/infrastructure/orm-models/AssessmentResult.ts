// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Assessment');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./CompetenceMark');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'AssessmentResult';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'assessment-results',
    hasTimestamps: ['createdAt', null],

    validations: {
      status: [
        {
          method: 'isIn',
          error: "Le status de la certification n'est pas valide",
          args: ['validated', 'rejected', 'error', 'cancelled'],
        },
      ],
    },

    assessment() {
      return this.belongsTo('Assessments');
    },

    competenceMarks() {
      return this.hasMany('CompetenceMark', 'assessmentResultId');
    },
  },
  {
    modelName,
  }
);
