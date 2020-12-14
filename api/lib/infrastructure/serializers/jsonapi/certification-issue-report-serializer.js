const { Serializer } = require('jsonapi-serializer');

module.exports = {

  serialize(certificationIssueReports) {
    return new Serializer('certification-issue-report', {
      attributes: [
        'category',
        'description',
      ],
      transform: function(certificationIssueReport) {
        return Object.assign({}, certificationIssueReport);
      },
    }).serialize(certificationIssueReports);
  },

  deserialize(request) {
    const certificationCourseId = parseInt(request.params.id);
    const attributes = request.payload.data.attributes;

    return {
      certificationCourseId,
      category: attributes.category,
      description: attributes.description,
    };
  },
};