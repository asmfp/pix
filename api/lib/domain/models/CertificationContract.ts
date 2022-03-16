// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationComputeError } = require('../../../lib/domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationContract {
  /* PUBLIC INTERFACE */
  static assertThatWeHaveEnoughAnswers(listAnswers: any, listChallenges: any) {
    const someUnansweredChallenges = _.some(listChallenges, (challenge: any) => {
      return !challenge.hasBeenSkippedAutomatically &&
      !challenge.isNeutralized &&
      !listAnswers.find((answer: any) => answer.challengeId === challenge.challengeId);
    });

    if (someUnansweredChallenges) {
      throw new CertificationComputeError('L’utilisateur n’a pas répondu à toutes les questions');
    }
  }

  static assertThatCompetenceHasAtLeastOneChallenge(challengesForCompetence: any, competenceIndex: any) {
    if (challengesForCompetence.length === 0) {
      throw new CertificationComputeError('Pas assez de challenges posés pour la compétence ' + competenceIndex);
    }
  }

  static assertThatScoreIsCoherentWithReproducibilityRate(scoreAfterRating: any, reproducibilityRate: any) {
    if (scoreAfterRating < 1 && reproducibilityRate > 50) {
      throw new CertificationComputeError('Rejeté avec un taux de reproductibilité supérieur à 50');
    }
  }

  static assertThatEveryAnswerHasMatchingChallenge(answersForCompetence: any, challengesForCompetence: any) {
    answersForCompetence.forEach((answer: any) => {
      const challenge = _.find(challengesForCompetence, { challengeId: answer.challengeId });
      if (!challenge) {
        throw new CertificationComputeError('Problème de chargement du challenge ' + answer.challengeId);
      }
    });
  }

  static assertThatNoChallengeHasMoreThanOneAnswer(answersForCompetence: any) {
    const someChallengesHaveMoreThanOneAnswer = _(answersForCompetence)
      .groupBy((answer: any) => answer.challengeId)
      .some((answerGroup: any) => answerGroup.length > 1);

    if (someChallengesHaveMoreThanOneAnswer) {
      throw new CertificationComputeError('Plusieurs réponses pour une même épreuve');
    }
  }

  static hasEnoughNonNeutralizedChallengesToBeTrusted(numberOfChallenges: any, numberOfNonNeutralizedChallenges: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    const minimalNumberOfNonNeutralizedChallengesToBeTrusted = Math.ceil(numberOfChallenges * 0.66);
    return numberOfNonNeutralizedChallenges >= minimalNumberOfNonNeutralizedChallengesToBeTrusted;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationContract;
