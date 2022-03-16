// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Answer'.
const Answer = require('./Answer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('./AnswerStatus');

/**
 * Traduction: Correcteur
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Examiner'.
class Examiner {
  validator: any;
  constructor({
    validator
  }: any = {}) {
    this.validator = validator;
  }

  evaluate({
    answer,
    challengeFormat,
    isCertificationEvaluation
  }: any) {
    const correctedAnswer = new Answer(answer);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'FAKE_VALUE_FOR_SKIPPED_QUESTIONS' does n... Remove this comment to see the full error message
    if (answer.value === Answer.FAKE_VALUE_FOR_SKIPPED_QUESTIONS) {
      correctedAnswer.result = AnswerStatus.SKIPPED;
      correctedAnswer.resultDetails = null;

      return correctedAnswer;
    }

    const answerValidation = this.validator.assess({ answer, challengeFormat });
    correctedAnswer.result = answerValidation.result;
    correctedAnswer.resultDetails = answerValidation.resultDetails;

    const isCorrectAnswer = answerValidation.result.isOK();

    if (isCorrectAnswer && answer.hasTimedOut) {
      correctedAnswer.result = AnswerStatus.TIMEDOUT;
    }

    if (isCorrectAnswer && answer.isFocusedOut && isCertificationEvaluation) {
      correctedAnswer.result = AnswerStatus.FOCUSEDOUT;
    }

    return correctedAnswer;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Examiner;
