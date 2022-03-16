// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
class SessionForSupervisorKit {
  accessCode: any;
  address: any;
  date: any;
  examiner: any;
  id: any;
  room: any;
  supervisorPassword: any;
  time: any;
  constructor({
    id,
    date,
    time,
    address,
    room,
    examiner,
    accessCode,
    supervisorPassword
  }: any) {
    this.id = id;
    this.date = date;
    this.time = time;
    this.address = address;
    this.room = room;
    this.examiner = examiner;
    this.accessCode = accessCode;
    this.supervisorPassword = supervisorPassword;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SessionForSupervisorKit;
