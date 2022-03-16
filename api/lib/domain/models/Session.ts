// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'config'.
const config = require('../../config');

const CREATED = 'created';
const FINALIZED = 'finalized';
const IN_PROCESS = 'in_process';
const PROCESSED = 'processed';

const availableCharactersForPasswordGeneration =
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'split' does not exist on type 'string'.
  `${config.availableCharacterForCode.numbers}${config.availableCharacterForCode.letters}`.split('');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NB_CHAR'.
const NB_CHAR = 5;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  CREATED,
  FINALIZED,
  IN_PROCESS,
  PROCESSED,
};

// @ts-expect-error ts-migrate(7005) FIXME: Variable 'NO_EXAMINER_GLOBAL_COMMENT' implicitly h... Remove this comment to see the full error message
const NO_EXAMINER_GLOBAL_COMMENT = null;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Session'.
class Session {
  accessCode: any;
  address: any;
  assignedCertificationOfficerId: any;
  certificationCandidates: any;
  certificationCenter: any;
  certificationCenterId: any;
  date: any;
  description: any;
  examiner: any;
  examinerGlobalComment: any;
  finalizedAt: any;
  id: any;
  publishedAt: any;
  resultsSentToPrescriberAt: any;
  room: any;
  supervisorPassword: any;
  time: any;
  constructor({
    id,
    accessCode,
    address,
    certificationCenter,
    date,
    description,
    examiner,
    room,
    time,
    examinerGlobalComment,
    finalizedAt,
    resultsSentToPrescriberAt,
    publishedAt,
    certificationCandidates,
    certificationCenterId,
    assignedCertificationOfficerId,
    supervisorPassword
  }: any = {}) {
    this.id = id;
    this.accessCode = accessCode;
    this.address = address;
    this.certificationCenter = certificationCenter;
    this.date = date;
    this.description = description;
    this.examiner = examiner;
    this.room = room;
    this.time = time;
    this.examinerGlobalComment = examinerGlobalComment;
    this.finalizedAt = finalizedAt;
    this.resultsSentToPrescriberAt = resultsSentToPrescriberAt;
    this.publishedAt = publishedAt;
    this.certificationCandidates = certificationCandidates;
    this.certificationCenterId = certificationCenterId;
    this.assignedCertificationOfficerId = assignedCertificationOfficerId;
    this.supervisorPassword = supervisorPassword;
  }

  areResultsFlaggedAsSent() {
    return !_.isNil(this.resultsSentToPrescriberAt);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get status() {
    if (this.publishedAt) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'PROCESSED' does not exist on type '{ DOW... Remove this comment to see the full error message
      return statuses.PROCESSED;
    }
    if (this.assignedCertificationOfficerId) {
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

  isPublished() {
    return this.publishedAt !== null;
  }

  isAccessible() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'CREATED' does not exist on type '{ DOWNG... Remove this comment to see the full error message
    return this.status === statuses.CREATED;
  }

  generateSupervisorPassword() {
    this.supervisorPassword = _.times(NB_CHAR, _randomCharacter).join('');
  }

  isSupervisable(supervisorPassword: any) {
    return this.supervisorPassword === supervisorPassword;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Session;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.statuses = statuses;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.NO_EXAMINER_GLOBAL_COMMENT = NO_EXAMINER_GLOBAL_COMMENT;

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _randomCharacter() {
  return _.sample(availableCharactersForPasswordGeneration);
}
