// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(competenceEvaluations: any) {
    return new Serializer('competence-evaluations', {
      transform(current: any) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        const competenceEvaluation = Object.assign({}, current);
        competenceEvaluation.assessment = { id: current.assessmentId };
        return competenceEvaluation;
      },
      attributes: ['createdAt', 'updatedAt', 'userId', 'competenceId', 'assessment', 'scorecard', 'status'],
      assessment: {
        ref: 'id',
        included: false,
      },
      scorecard: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record: any) {
            return `/api/scorecards/${record.userId}_${record.competenceId}`;
          },
        },
      },
    }).serialize(competenceEvaluations);
  },
};
