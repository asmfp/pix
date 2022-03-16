// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../models/AssessmentResult');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../models/CompetenceMark');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationRescoringCompleted = require('./CertificationRescoringCompleted.js');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationComputeError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ChallengeN... Remove this comment to see the full error message
const ChallengeNeutralized = require('./ChallengeNeutralized');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ChallengeD... Remove this comment to see the full error message
const ChallengeDeneutralized = require('./ChallengeDeneutralized');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationJuryDone = require('./CertificationJuryDone');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [ChallengeNeutralized, ChallengeDeneutralized, CertificationJuryDone];
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EMITTER'.
const EMITTER = 'PIX-ALGO-NEUTRALIZATION';

async function handleCertificationRescoring({
  event,
  assessmentResultRepository,
  certificationAssessmentRepository,
  competenceMarkRepository,
  scoringCertificationService,
  certificationCourseRepository
}: any) {
  checkEventTypes(event, eventTypes);

  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
    certificationCourseId: event.certificationCourseId,
  });

  try {
    const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
      certificationAssessment,
      continueOnError: false,
    });

    const assessmentResultId = await _saveAssessmentResult(
      certificationAssessmentScore,
      certificationAssessment,
      event,
      assessmentResultRepository
    );

    await _saveCompetenceMarks(certificationAssessmentScore, assessmentResultId, competenceMarkRepository);

    await _cancelCertificationCourseIfHasNotEnoughNonNeutralizedChallengesToBeTrusted({
      certificationCourseId: certificationAssessment.certificationCourseId,
      hasEnoughNonNeutralizedChallengesToBeTrusted:
        certificationAssessmentScore.hasEnoughNonNeutralizedChallengesToBeTrusted,
      certificationCourseRepository,
    });

    return new CertificationRescoringCompleted({
      userId: certificationAssessment.userId,
      certificationCourseId: certificationAssessment.certificationCourseId,
      reproducibilityRate: certificationAssessmentScore.percentageCorrectAnswers,
    });
  } catch (error) {
    if (!(error instanceof CertificationComputeError)) {
      throw error;
    }
    await _saveResultAfterCertificationComputeError({
      certificationAssessment,
      assessmentResultRepository,
      certificationComputeError: error,
      juryId: event.juryId,
    });
  }
}

async function _cancelCertificationCourseIfHasNotEnoughNonNeutralizedChallengesToBeTrusted({
  certificationCourseId,
  hasEnoughNonNeutralizedChallengesToBeTrusted,
  certificationCourseRepository
}: any) {
  const certificationCourse = await certificationCourseRepository.get(certificationCourseId);
  if (hasEnoughNonNeutralizedChallengesToBeTrusted) {
    certificationCourse.uncancel();
  } else {
    certificationCourse.cancel();
  }

  return certificationCourseRepository.update(certificationCourse);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
async function _saveResultAfterCertificationComputeError({
  certificationAssessment,
  assessmentResultRepository,
  certificationComputeError,
  juryId
}: any) {
  const assessmentResult = AssessmentResult.buildAlgoErrorResult({
    error: certificationComputeError,
    assessmentId: certificationAssessment.id,
    juryId,
    emitter: EMITTER,
  });
  await assessmentResultRepository.save(assessmentResult);
}

async function _saveAssessmentResult(
  certificationAssessmentScore: any,
  certificationAssessment: any,
  event: any,
  assessmentResultRepository: any
) {
  let assessmentResult;
  if (!certificationAssessmentScore.hasEnoughNonNeutralizedChallengesToBeTrusted) {
    assessmentResult = AssessmentResult.buildNotTrustableAssessmentResult({
      pixScore: certificationAssessmentScore.nbPix,
      status: certificationAssessmentScore.status,
      assessmentId: certificationAssessment.id,
      emitter: EMITTER,
      juryId: event.juryId,
    });
  } else {
    assessmentResult = AssessmentResult.buildStandardAssessmentResult({
      pixScore: certificationAssessmentScore.nbPix,
      status: certificationAssessmentScore.status,
      assessmentId: certificationAssessment.id,
      emitter: EMITTER,
      juryId: event.juryId,
    });
  }
  const { id: assessmentResultId } = await assessmentResultRepository.save(assessmentResult);
  return assessmentResultId;
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _saveCompetenceMarks(certificationAssessmentScore: any, assessmentResultId: any, competenceMarkRepository: any) {
  await bluebird.mapSeries(certificationAssessmentScore.competenceMarks, (competenceMark: any) => {
    const competenceMarkDomain = new CompetenceMark({ ...competenceMark, assessmentResultId });
    return competenceMarkRepository.save(competenceMarkDomain);
  });
}

handleCertificationRescoring.eventTypes = eventTypes;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handleCertificationRescoring;
