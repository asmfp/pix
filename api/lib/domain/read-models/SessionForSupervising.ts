// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
class SessionForSupervising {
  certificationCandidates: any;
  certificationCenterName: any;
  date: any;
  examiner: any;
  id: any;
  room: any;
  time: any;
  constructor({
    id,
    date,
    time,
    examiner,
    certificationCenterName,
    room,
    certificationCandidates
  }: any = {}) {
    this.id = id;
    this.date = date;
    this.time = time;
    this.examiner = examiner;
    this.certificationCenterName = certificationCenterName;
    this.room = room;
    this.certificationCandidates = certificationCandidates;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SessionForSupervising;
