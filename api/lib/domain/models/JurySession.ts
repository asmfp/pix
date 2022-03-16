// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'statuses'.
const { statuses } = require('./Session');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JurySessio... Remove this comment to see the full error message
class JurySession {
  accessCode: any;
  address: any;
  assignedCertificationOfficer: any;
  certificationCenterExternalId: any;
  certificationCenterId: any;
  certificationCenterName: any;
  certificationCenterType: any;
  date: any;
  description: any;
  examiner: any;
  examinerGlobalComment: any;
  finalizedAt: any;
  id: any;
  juryComment: any;
  juryCommentAuthor: any;
  juryCommentedAt: any;
  publishedAt: any;
  resultsSentToPrescriberAt: any;
  room: any;
  time: any;
  constructor({
    id,
    certificationCenterName,
    certificationCenterType,
    certificationCenterId,
    certificationCenterExternalId,
    address,
    room,
    examiner,
    date,
    time,
    accessCode,
    description,
    examinerGlobalComment,
    finalizedAt,
    resultsSentToPrescriberAt,
    publishedAt,
    assignedCertificationOfficer,
    juryComment,
    juryCommentedAt,
    juryCommentAuthor
  }: any = {}) {
    this.id = id;
    this.certificationCenterName = certificationCenterName;
    this.certificationCenterType = certificationCenterType;
    this.certificationCenterId = certificationCenterId;
    this.certificationCenterExternalId = certificationCenterExternalId;
    this.address = address;
    this.room = room;
    this.examiner = examiner;
    this.date = date;
    this.time = time;
    this.accessCode = accessCode;
    this.description = description;
    this.examinerGlobalComment = examinerGlobalComment;
    this.finalizedAt = finalizedAt;
    this.resultsSentToPrescriberAt = resultsSentToPrescriberAt;
    this.publishedAt = publishedAt;
    this.assignedCertificationOfficer = assignedCertificationOfficer;
    this.juryComment = juryComment;
    this.juryCommentedAt = juryCommentedAt;
    this.juryCommentAuthor = juryCommentAuthor;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get status() {
    if (this.publishedAt) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'PROCESSED' does not exist on type '{ DOW... Remove this comment to see the full error message
      return statuses.PROCESSED;
    }
    if (this.assignedCertificationOfficer) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'IN_PROCESS' does not exist on type '{ DO... Remove this comment to see the full error message
      return statuses.IN_PROCESS;
    }
    if (this.finalizedAt) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'FINALIZED' does not exist on type '{ DOW... Remove this comment to see the full error message
      return statuses.FINALIZED;
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'CREATED' does not exist on type '{ DOWNG... Remove this comment to see the full error message
    return statuses.CREATED;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = JurySession;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.statuses = statuses;
