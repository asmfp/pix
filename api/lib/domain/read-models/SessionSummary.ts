// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'statuses'.
const { statuses } = require('../models/Session');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionSum... Remove this comment to see the full error message
class SessionSummary {
  address: any;
  date: any;
  effectiveCandidatesCount: any;
  enrolledCandidatesCount: any;
  examiner: any;
  id: any;
  room: any;
  status: any;
  time: any;
  constructor({
    id,
    address,
    room,
    date,
    time,
    examiner,
    enrolledCandidatesCount,
    effectiveCandidatesCount,
    status
  }: any = {}) {
    this.id = id;
    this.address = address;
    this.room = room;
    this.date = date;
    this.time = time;
    this.examiner = examiner;
    this.enrolledCandidatesCount = enrolledCandidatesCount;
    this.effectiveCandidatesCount = effectiveCandidatesCount;
    this.status = status;
  }

  static from({
    id,
    address,
    room,
    date,
    time,
    examiner,
    enrolledCandidatesCount,
    effectiveCandidatesCount,
    finalizedAt,
    publishedAt
  }: any) {
    const status = _computeStatus({
      finalizedAt,
      publishedAt,
    });

    return new SessionSummary({
      id,
      address,
      room,
      date,
      time,
      examiner,
      enrolledCandidatesCount,
      effectiveCandidatesCount,
      status,
    });
  }
}

function _computeStatus({
  finalizedAt,
  publishedAt
}: any) {
  if (publishedAt) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PROCESSED' does not exist on type '{ DOW... Remove this comment to see the full error message
    return statuses.PROCESSED;
  }
  if (finalizedAt) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'FINALIZED' does not exist on type '{ DOW... Remove this comment to see the full error message
    return statuses.FINALIZED;
  }
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'CREATED' does not exist on type '{ DOWNG... Remove this comment to see the full error message
  return statuses.CREATED;
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'statuses' does not exist on type 'typeof... Remove this comment to see the full error message
SessionSummary.statuses = {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'CREATED' does not exist on type '{ DOWNG... Remove this comment to see the full error message
  CREATED: statuses.CREATED,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'FINALIZED' does not exist on type '{ DOW... Remove this comment to see the full error message
  FINALIZED: statuses.FINALIZED,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'PROCESSED' does not exist on type '{ DOW... Remove this comment to see the full error message
  PROCESSED: statuses.PROCESSED,
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SessionSummary;
