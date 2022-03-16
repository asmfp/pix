// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class NeutralizationAttempt {
  questionNumber: any;
  status: any;
  constructor(questionNumber: any, status: any) {
    this.questionNumber = questionNumber;
    this.status = status;
  }

  static neutralized(questionNumber: any) {
    return new NeutralizationAttempt(questionNumber, NeutralizationStatus.NEUTRALIZED);
  }

  static failure(questionNumber: any) {
    return new NeutralizationAttempt(questionNumber, NeutralizationStatus.FAILURE);
  }

  static skipped(questionNumber: any) {
    return new NeutralizationAttempt(questionNumber, NeutralizationStatus.SKIPPED);
  }

  hasFailed() {
    return this.status === NeutralizationStatus.FAILURE;
  }

  hasSucceeded() {
    return this.status === NeutralizationStatus.NEUTRALIZED;
  }

  wasSkipped() {
    return this.status === NeutralizationStatus.SKIPPED;
  }
};

const NeutralizationStatus = {
  NEUTRALIZED: 'NEUTRALIZED',
  FAILURE: 'FAILURE',
  SKIPPED: 'SKIPPED',
};
