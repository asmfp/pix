// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../domain/models/Assessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Progressio... Remove this comment to see the full error message
const Progression = require('../../../domain/models/Progression');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(assessments: any) {
    return new Serializer('assessment', {
      transform(currentAssessment: any) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        const assessment = Object.assign({}, currentAssessment);

        // TODO: We can't use currentAssessment.isCertification() because
        // this serializer is also used by model CampaignAssessment
        assessment.certificationNumber = null;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
        if (currentAssessment.type === Assessment.types.CERTIFICATION) {
          assessment.certificationNumber = currentAssessment.certificationCourseId;
          assessment.certificationCourse = { id: currentAssessment.certificationCourseId };
        }

        // Same here for isForCampaign() and isCompetenceEvaluation()
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
        if ([Assessment.types.CAMPAIGN, Assessment.types.COMPETENCE_EVALUATION].includes(currentAssessment.type)) {
          assessment.progression = {
            id: Progression.generateIdFromAssessmentId(currentAssessment.id),
          };
        }

        if (currentAssessment.campaignParticipation && currentAssessment.campaignParticipation.campaign) {
          assessment.codeCampaign = currentAssessment.campaignParticipation.campaign.code;
        }

        if (!currentAssessment.course) {
          assessment.course = { id: currentAssessment.courseId };
        }

        assessment.title = currentAssessment.title;

        return assessment;
      },
      attributes: [
        'title',
        'type',
        'state',
        'answers',
        'codeCampaign',
        'certificationNumber',
        'course',
        'certificationCourse',
        'progression',
        'competenceId',
        'lastQuestionState',
        'method',
      ],
      answers: {
        ref: 'id',
        relationshipLinks: {
          related(record: any) {
            return `/api/answers?assessmentId=${record.id}`;
          },
        },
      },
      course: {
        ref: 'id',
        included: _includeCourse(assessments),
        attributes: ['name', 'description', 'nbChallenges'],
      },
      certificationCourse: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related(record: any, current: any) {
            return `/api/certification-courses/${current.id}`;
          },
        },
      },
      progression: {
        ref: 'id',
        relationshipLinks: {
          related(record: any, current: any) {
            return `/api/progressions/${current.id}`;
          },
        },
      },
    }).serialize(assessments);
  },

  deserialize(json: any) {
    const type = json.data.attributes.type;
    const method = Assessment.computeMethodFromType(type);

    let courseId = null;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
    if (type !== Assessment.types.CAMPAIGN && type !== Assessment.types.PREVIEW) {
      courseId = json.data.relationships.course.data.id;
    }

    return new Assessment({
      id: json.data.id,
      type,
      courseId,
      method,
    });
  },
};

function _includeCourse(assessments: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
  if (Array.isArray(assessments)) {
    return assessments.length && assessments[0].course;
  }

  return assessments.course ? true : false;
}
