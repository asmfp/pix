// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../models/Assessment');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getAssessment({
  assessmentId,
  locale,
  assessmentRepository,
  competenceRepository,
  courseRepository
}: any) {
  const assessment = await assessmentRepository.getWithAnswersAndCampaignParticipation(assessmentId);
  if (!assessment) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`Assessment not found for ID ${assessmentId}`);
  }

  assessment.title = await _fetchAssessmentTitle({
    assessment,
    locale,
    competenceRepository,
    courseRepository,
  });

  return assessment;
};

async function _fetchAssessmentTitle({
  assessment,
  locale,
  competenceRepository,
  courseRepository
}: any) {
  switch (assessment.type) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
    case Assessment.types.CERTIFICATION: {
      return assessment.certificationCourseId;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
    case Assessment.types.COMPETENCE_EVALUATION: {
      return await competenceRepository.getCompetenceName({ id: assessment.competenceId, locale });
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
    case Assessment.types.DEMO: {
      return await courseRepository.getCourseName(assessment.courseId);
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
    case Assessment.types.PREVIEW: {
      return 'Preview';
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'types' does not exist on type 'typeof As... Remove this comment to see the full error message
    case Assessment.types.CAMPAIGN: {
      return assessment.campaignParticipation.campaign.title;
    }

    default:
      return '';
  }
}
