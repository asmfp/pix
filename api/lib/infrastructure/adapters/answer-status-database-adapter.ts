// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../domain/models/AnswerStatus');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UNIMPLEMEN... Remove this comment to see the full error message
const UNIMPLEMENTED = 'unimplemented';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TIMEDOUT'.
const TIMEDOUT = 'timedout';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PARTIALLY'... Remove this comment to see the full error message
const PARTIALLY = 'partially';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SKIPPED'.
const SKIPPED = 'aband';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'FOCUSEDOUT... Remove this comment to see the full error message
const FOCUSEDOUT = 'focusedOut';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'OK'.
const OK = 'ok';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KO'.
const KO = 'ko';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  /**
   * @deprecated use toSQLString instead
   */
  adapt(answerStatus: any) {
    return this.toSQLString(answerStatus);
  },

  toSQLString(answerStatus: any) {
    if (answerStatus.isOK()) {
      return OK;
    } else if (answerStatus.isKO()) {
      return KO;
    } else if (answerStatus.isSKIPPED()) {
      return SKIPPED;
    } else if (answerStatus.isPARTIALLY()) {
      return PARTIALLY;
    } else if (answerStatus.isTIMEDOUT()) {
      return TIMEDOUT;
    } else if (answerStatus.isFOCUSEDOUT()) {
      return FOCUSEDOUT;
    } else {
      return UNIMPLEMENTED;
    }
  },

  fromSQLString(answerStatusString: any) {
    if (answerStatusString === OK) {
      return AnswerStatus.OK;
    } else if (answerStatusString === KO) {
      return AnswerStatus.KO;
    } else if (answerStatusString === PARTIALLY) {
      return AnswerStatus.PARTIALLY;
    } else if (answerStatusString === TIMEDOUT) {
      return AnswerStatus.TIMEDOUT;
    } else if (answerStatusString === SKIPPED) {
      return AnswerStatus.SKIPPED;
    } else if (answerStatusString === FOCUSEDOUT) {
      return AnswerStatus.FOCUSEDOUT;
    } else if (answerStatusString === UNIMPLEMENTED) {
      return AnswerStatus.UNIMPLEMENTED;
    }
  },
};
