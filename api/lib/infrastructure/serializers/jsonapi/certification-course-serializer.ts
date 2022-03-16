// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificationCourse: any, isEndTestScreenRemovalEnabled: any) {
    return new Serializer('certification-course', {
      transform(currentCertificationCourse: any) {
        const certificationCourseDTO = currentCertificationCourse.toDTO();
        certificationCourseDTO.nbChallenges = certificationCourseDTO?.challenges?.length ?? 0;
        certificationCourseDTO.examinerComment = certificationCourseDTO.certificationIssueReports?.[0]?.description;
        certificationCourseDTO.isEndTestScreenRemovalEnabled = isEndTestScreenRemovalEnabled;
        return certificationCourseDTO;
      },
      attributes: [
        'assessment',
        'nbChallenges',
        'examinerComment',
        'hasSeenEndTestScreen',
        'firstName',
        'lastName',
        'isEndTestScreenRemovalEnabled',
      ],
      assessment: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related(record: any, current: any) {
            return `/api/assessments/${current.id}`;
          },
        },
      },
    }).serialize(certificationCourse);
  },
};
