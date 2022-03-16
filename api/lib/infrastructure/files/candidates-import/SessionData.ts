// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class SessionData {
  accessCode: any;
  address: any;
  assignedCertificationOfficerId: any;
  certificationCenter: any;
  certificationCenterId: any;
  date: any;
  description: any;
  endTime: any;
  examiner: any;
  examinerGlobalComment: any;
  finalizedAt: any;
  id: any;
  publishedAt: any;
  resultsSentToPrescriberAt: any;
  room: any;
  startTime: any;
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
    certificationCenterId,
    assignedCertificationOfficerId
  }: any) {
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
    this.certificationCenterId = certificationCenterId;
    this.assignedCertificationOfficerId = assignedCertificationOfficerId;
    this.startTime = moment(time, 'HH:mm').format('HH:mm');
    this.endTime = moment(time, 'HH:mm').add(moment.duration(2, 'hours')).format('HH:mm');
    this.date = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
  }

  static fromSession(session: any) {
    return new SessionData(session);
  }
};
