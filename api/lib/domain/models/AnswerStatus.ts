// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'OK'.
const OK = 'ok';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KO'.
const KO = 'ko';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SKIPPED'.
const SKIPPED = 'aband';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TIMEDOUT'.
const TIMEDOUT = 'timedout';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'FOCUSEDOUT... Remove this comment to see the full error message
const FOCUSEDOUT = 'focusedOut';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PARTIALLY'... Remove this comment to see the full error message
const PARTIALLY = 'partially';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UNIMPLEMEN... Remove this comment to see the full error message
const UNIMPLEMENTED = 'unimplemented';

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
class AnswerStatus {
  status: any;
  constructor({
    status
  }: any = {}) {
    // TODO: throw a BadAnswerStatus error if the status is bad + adapt the tests
    this.status = status;
  }

  /* PUBLIC INTERFACE */
  isFailed() {
    return this.status !== OK;
  }

  isOK() {
    return this.status === OK;
  }
  isKO() {
    return this.status === KO;
  }
  isSKIPPED() {
    return this.status === SKIPPED;
  }
  isTIMEDOUT() {
    return this.status === TIMEDOUT;
  }
  isFOCUSEDOUT() {
    return this.status === FOCUSEDOUT;
  }
  isPARTIALLY() {
    return this.status === PARTIALLY;
  }
  isUNIMPLEMENTED() {
    return this.status === UNIMPLEMENTED;
  }

  /* PUBLIC CONSTRUCTORS */
  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  static get OK() {
    return new AnswerStatus({ status: OK });
  }
  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  static get KO() {
    return new AnswerStatus({ status: KO });
  }
  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  static get SKIPPED() {
    return new AnswerStatus({ status: SKIPPED });
  }
  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  static get TIMEDOUT() {
    return new AnswerStatus({ status: TIMEDOUT });
  }
  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  static get FOCUSEDOUT() {
    return new AnswerStatus({ status: FOCUSEDOUT });
  }
  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  static get PARTIALLY() {
    return new AnswerStatus({ status: PARTIALLY });
  }
  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  static get UNIMPLEMENTED() {
    return new AnswerStatus({ status: UNIMPLEMENTED });
  }

  /* METHODES DE TRANSITION */
  static isFailed(otherResult: any) {
    return AnswerStatus.from(otherResult).isFailed();
  }
  static isOK(otherResult: any) {
    return AnswerStatus.from(otherResult).isOK();
  }
  static isKO(otherResult: any) {
    return AnswerStatus.from(otherResult).isKO();
  }
  static isSKIPPED(otherResult: any) {
    return AnswerStatus.from(otherResult).isSKIPPED();
  }
  static isPARTIALLY(otherResult: any) {
    return AnswerStatus.from(otherResult).isPARTIALLY();
  }
  static isFOCUSEDOUT(otherResult: any) {
    return AnswerStatus.from(otherResult).isFOCUSEDOUT();
  }

  /* PRIVATE */
  static from(other: any) {
    if (other instanceof AnswerStatus) {
      return other;
    } else {
      return new AnswerStatus({ status: other });
    }
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AnswerStatus;
