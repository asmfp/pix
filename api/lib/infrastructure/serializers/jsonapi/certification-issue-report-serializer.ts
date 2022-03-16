// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificationIssueReports: any) {
    return new Serializer('certification-issue-report', {
      attributes: ['category', 'description', 'subcategory', 'questionNumber'],
      transform: function (certificationIssueReport: any) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        return Object.assign({}, certificationIssueReport);
      },
    }).serialize(certificationIssueReports);
  },

  deserialize(request: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    const certificationCourseId = parseInt(request.params.id);
    const attributes = request.payload.data.attributes;

    return {
      certificationCourseId,
      category: attributes.category,
      description: attributes.description,
      subcategory: attributes.subcategory,
      questionNumber: attributes['question-number'],
    };
  },
};
