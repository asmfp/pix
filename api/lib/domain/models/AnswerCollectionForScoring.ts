// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
const qrocmDepChallenge = 'QROCM-dep';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class AnswerCollectionForScoring {
  challengesWithAnswers: any;
  constructor(challengesWithAnswers: any) {
    this.challengesWithAnswers = challengesWithAnswers;
  }

  static from({
    answers,
    challenges
  }: any) {
    const challengesWithAnswers = challenges.map((challenge: any) => {
      const answer = answers.find((answer: any) => answer.challengeId === challenge.challengeId);

      return new ChallengeWithAnswer(answer, challenge);
    });

    return new AnswerCollectionForScoring(challengesWithAnswers);
  }

  numberOfChallenges() {
    return this.challengesWithAnswers.length;
  }

  numberOfCorrectAnswers() {
    let nbOfCorrectAnswers = 0;
    this.challengesWithAnswers.forEach((challengeWithAnswer: any) => {
      if (!challengeWithAnswer.isNeutralized() && challengeWithAnswer.isCorrect()) {
        nbOfCorrectAnswers++;
      }
    });

    return nbOfCorrectAnswers;
  }

  numberOfNonNeutralizedChallenges() {
    let numberOfNonNeutralizedChallenges = 0;
    this.challengesWithAnswers.forEach((challengeWithAnswer: any) => {
      if (!challengeWithAnswer.isNeutralized() && challengeWithAnswer.isAnswered()) {
        numberOfNonNeutralizedChallenges++;
      }
    });

    return numberOfNonNeutralizedChallenges;
  }

  numberOfChallengesForCompetence(competenceId: any) {
    const challengesForCompetence = this.challengesWithAnswers.filter(
      (challengeWithAnswer: any) => challengeWithAnswer.competenceId() === competenceId
    );
    const numberOfChallenges = _(challengesForCompetence)
      .map((challenge: any) => {
        if (challengesForCompetence.length < 3 && challenge.isQROCMdep()) {
          return 2;
        } else {
          return 1;
        }
      })
      .sum();
    return numberOfChallenges;
  }

  numberOfCorrectAnswersForCompetence(competenceId: any) {
    const challengesWithAnswersForCompetence = this.challengesWithAnswers.filter(
      (challengeWithAnswer: any) => challengeWithAnswer.competenceId() === competenceId
    );
    let nbOfCorrectAnswers = 0;
    challengesWithAnswersForCompetence.forEach((challengeWithAnswer: any) => {
      if (!challengeWithAnswer.isNeutralized()) {
        if (challengesWithAnswersForCompetence.length < 3 && challengeWithAnswer.isAFullyCorrectQROCMdep()) {
          nbOfCorrectAnswers += 2;
        } else if (challengesWithAnswersForCompetence.length < 3 && challengeWithAnswer.isAPartiallyCorrectQROCMdep()) {
          nbOfCorrectAnswers += 1;
        } else if (challengeWithAnswer.isCorrect()) {
          nbOfCorrectAnswers += 1;
        }
      }
    });

    return _.min([nbOfCorrectAnswers, 3]);
  }

  numberOfNeutralizedChallengesForCompetence(competenceId: any) {
    const answersForCompetence = this.challengesWithAnswers.filter(
      (challengeWithAnswer: any) => challengeWithAnswer.competenceId() === competenceId
    );
    return _(answersForCompetence)
      .map((answer: any) => {
        if (answer.isNeutralized()) {
          if (answersForCompetence.length < 3 && answer.isQROCMdep()) {
            return 2;
          } else {
            return 1;
          }
        } else {
          return 0;
        }
      })
      .sum();
  }
};

class ChallengeWithAnswer {
  _answer: any;
  _challenge: any;
  constructor(answer: any, challenge: any) {
    this._answer = answer;
    this._challenge = challenge;
  }

  isAnswered() {
    return this._answer || this._challenge.hasBeenSkippedAutomatically;
  }

  isQROCMdep() {
    const challengeType = this._challenge ? this._challenge.type : '';
    return challengeType === qrocmDepChallenge;
  }

  isCorrect() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this._answer?.isOk());
  }

  isAFullyCorrectQROCMdep() {
    return this.isQROCMdep() && this.isCorrect();
  }

  isAPartiallyCorrectQROCMdep() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return this.isQROCMdep() && Boolean(this._answer) && this._answer.isPartially();
  }

  isNeutralized() {
    return this._challenge.isNeutralized;
  }

  competenceId() {
    return this._challenge.competenceId;
  }
}
