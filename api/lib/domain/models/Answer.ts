// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('./AnswerStatus');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Answer'.
class Answer {
  assessmentId: any;
  challenge: any;
  challengeId: any;
  id: any;
  isFocusedOut: any;
  levelup: any;
  result: any;
  resultDetails: any;
  timeSpent: any;
  timeout: any;
  value: any;
  constructor({
    id,
    result,
    resultDetails,
    timeout,
    isFocusedOut,
    value,
    levelup,
    assessmentId,
    challengeId,
    timeSpent
  }: any = {}) {
    this.id = id;
    // XXX result property should not be auto-created from result to an AnswerStatus Object
    this.result = AnswerStatus.from(result);
    this.resultDetails = resultDetails;
    this.timeout = timeout;
    this.isFocusedOut = isFocusedOut || this.result.isFOCUSEDOUT();
    this.value = value;
    this.levelup = levelup;
    this.assessmentId = assessmentId;
    this.challengeId = challengeId;
    this.timeSpent = timeSpent;
  }

  isOk() {
    return this.result.isOK();
  }

  isPartially() {
    return this.result.isPARTIALLY();
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get binaryOutcome() {
    return AnswerStatus.isOK(this.result) ? 1 : 0;
  }

  /**
   * @deprecated Method that does not belong here. Answer has no knowledge of challenge
   * Should maybe belong to challenge ?
   * (Demeter law broken this.challenge.skills.(first-object).difficulty
   */
  maxDifficulty(baseDifficulty = 2) {
    if (this.challenge) {
      const difficulties = this.challenge.skills.map((skill: any) => skill.difficulty);
      if (difficulties.length > 0) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
        return Math.max(...difficulties);
      }
    }
    // XXX : to avoid problem when challenge has no skill/ when we cannot get challenge
    return baseDifficulty;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get hasTimedOut() {
    return _.isInteger(this.timeout) && this.timeout < 0;
  }

  setTimeSpentFrom({
    now,
    lastQuestionDate
  }: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    this.timeSpent = Math.ceil((now.getTime() - lastQuestionDate.getTime()) / 1000);
  }
}

// FIXME: DO NOT accept "#ABAND#" as an answer, give this information with a boolean,
//  and transform it to an AnswerStatus "aband" in the api
// @ts-expect-error ts-migrate(2339) FIXME: Property 'FAKE_VALUE_FOR_SKIPPED_QUESTIONS' does n... Remove this comment to see the full error message
Answer.FAKE_VALUE_FOR_SKIPPED_QUESTIONS = '#ABAND#';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Answer;
