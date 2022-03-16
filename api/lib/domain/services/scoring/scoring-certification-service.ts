// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationContract = require('../../models/CertificationContract');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'scoringSer... Remove this comment to see the full error message
const scoringService = require('./scoring-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'placementP... Remove this comment to see the full error message
const placementProfileService = require('../placement-profile-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedL... Remove this comment to see the full error message
const { CertifiedLevel } = require('../../models/CertifiedLevel');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedS... Remove this comment to see the full error message
const { CertifiedScore } = require('../../models/CertifiedScore');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Reproducib... Remove this comment to see the full error message
const { ReproducibilityRate } = require('../../models/ReproducibilityRate');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../../models/CompetenceMark');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationAssessmentScore = require('../../models/CertificationAssessmentScore');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AnswerColl... Remove this comment to see the full error message
const AnswerCollectionForScoring = require('../../models/AnswerCollectionForScoring');

function _selectAnswersMatchingCertificationChallenges(answers: any, certificationChallenges: any) {
  return answers.filter(({
    challengeId
  }: any) => _.some(certificationChallenges, { challengeId }));
}

function _selectChallengesMatchingCompetences(certificationChallenges: any, testedCompetences: any) {
  return certificationChallenges.filter(({
    competenceId
  }: any) => _.some(testedCompetences, { id: competenceId }));
}

function _getSumScoreFromCertifiedCompetences(listCompetences: any) {
  return _(listCompetences).map('obtainedScore').sum();
}

function _getCompetenceMarksWithCertifiedLevelAndScore(
  answers: any,
  listCompetences: any,
  reproducibilityRate: any,
  certificationChallenges: any,
  continueOnError: any,
  answerCollection: any
) {
  return listCompetences.map((competence: any) => {
    const challengesForCompetence = _.filter(certificationChallenges, { competenceId: competence.id });
    const answersForCompetence = _selectAnswersMatchingCertificationChallenges(answers, challengesForCompetence);

    if (!continueOnError) {
      CertificationContract.assertThatCompetenceHasAtLeastOneChallenge(challengesForCompetence, competence.index);
      CertificationContract.assertThatEveryAnswerHasMatchingChallenge(answersForCompetence, challengesForCompetence);
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
      CertificationContract.assertThatNoChallengeHasMoreThanOneAnswer(answersForCompetence, challengesForCompetence);
    }

    const certifiedLevel = CertifiedLevel.from({
      numberOfChallenges: answerCollection.numberOfChallengesForCompetence(competence.id),
      numberOfCorrectAnswers: answerCollection.numberOfCorrectAnswersForCompetence(competence.id),
      numberOfNeutralizedAnswers: answerCollection.numberOfNeutralizedChallengesForCompetence(competence.id),
      estimatedLevel: competence.estimatedLevel,
      reproducibilityRate,
    });
    const certifiedScore = CertifiedScore.from({ certifiedLevel, estimatedScore: competence.pixScore });
    return new CompetenceMark({
      level: scoringService.getBlockedLevel(certifiedLevel.value),
      score: scoringService.getBlockedPixScore(certifiedScore.value),
      area_code: competence.area.code,
      competence_code: competence.index,
      competenceId: competence.id,
    });
  });
}

function _getCompetenceMarksWithFailedLevel(listCompetences: any) {
  return listCompetences.map((competence: any) => {
    return new CompetenceMark({
      level: scoringService.getBlockedLevel(CertifiedLevel.invalidate().value),
      score: scoringService.getBlockedPixScore(0),
      area_code: competence.area.code,
      competence_code: competence.index,
      competenceId: competence.id,
    });
  });
}

function _getResult(answers: any, certificationChallenges: any, testedCompetences: any, continueOnError: any) {
  if (!continueOnError) {
    CertificationContract.assertThatWeHaveEnoughAnswers(answers, certificationChallenges);
  }

  const answerCollection = AnswerCollectionForScoring.from({ answers, challenges: certificationChallenges });

  const reproducibilityRate = ReproducibilityRate.from({
    numberOfNonNeutralizedChallenges: answerCollection.numberOfNonNeutralizedChallenges(),
    numberOfCorrectAnswers: answerCollection.numberOfCorrectAnswers(),
  });

  const hasEnoughNonNeutralizedChallengesToBeTrusted =
    CertificationContract.hasEnoughNonNeutralizedChallengesToBeTrusted(
      answerCollection.numberOfChallenges(),
      answerCollection.numberOfNonNeutralizedChallenges()
    );

  if (!reproducibilityRate.isEnoughToBeCertified()) {
    return new CertificationAssessmentScore({
      competenceMarks: _getCompetenceMarksWithFailedLevel(testedCompetences),
      percentageCorrectAnswers: reproducibilityRate.value,
      hasEnoughNonNeutralizedChallengesToBeTrusted,
    });
  }

  const competenceMarks = _getCompetenceMarksWithCertifiedLevelAndScore(
    answers,
    testedCompetences,
    reproducibilityRate.value,
    certificationChallenges,
    continueOnError,
    answerCollection
  );
  const scoreAfterRating = _getSumScoreFromCertifiedCompetences(competenceMarks);

  if (!continueOnError) {
    CertificationContract.assertThatScoreIsCoherentWithReproducibilityRate(scoreAfterRating, reproducibilityRate.value);
  }

  return new CertificationAssessmentScore({
    competenceMarks,
    percentageCorrectAnswers: reproducibilityRate.value,
    hasEnoughNonNeutralizedChallengesToBeTrusted,
  });
}

async function _getTestedCompetences({
  userId,
  limitDate,
  isV2Certification
}: any) {
  const placementProfile = await placementProfileService.getPlacementProfile({ userId, limitDate, isV2Certification });
  return _(placementProfile.userCompetences)
    .filter((uc: any) => uc.isCertifiable())
    .map((uc: any) => _.pick(uc, ['id', 'area', 'index', 'name', 'estimatedLevel', 'pixScore']))
    .value();
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async calculateCertificationAssessmentScore({
    certificationAssessment,
    continueOnError
  }: any) {
    // userService.getPlacementProfile() + filter level > 0 => avec allCompetence (bug)
    const testedCompetences = await _getTestedCompetences({
      userId: certificationAssessment.userId,
      limitDate: certificationAssessment.createdAt,
      isV2Certification: certificationAssessment.isV2Certification,
    });

    // map sur challenges filtre sur competence Id - S'assurer qu'on ne travaille que sur les compétences certifiables
    const matchingCertificationChallenges = _selectChallengesMatchingCompetences(
      certificationAssessment.certificationChallenges,
      testedCompetences
    );

    // map sur challenges filtre sur challenge Id
    const matchingAnswers = _selectAnswersMatchingCertificationChallenges(
      certificationAssessment.certificationAnswersByDate,
      matchingCertificationChallenges
    );

    return _getResult(matchingAnswers, matchingCertificationChallenges, testedCompetences, continueOnError);
  },
};
