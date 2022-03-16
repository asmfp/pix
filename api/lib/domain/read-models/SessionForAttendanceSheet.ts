// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
class SessionForAttendanceSheet {
  address: any;
  certificationCandidates: any;
  certificationCenterName: any;
  certificationCenterType: any;
  date: any;
  examiner: any;
  id: any;
  isOrganizationManagingStudents: any;
  room: any;
  time: any;
  constructor({
    id,
    date,
    time,
    address,
    room,
    examiner,
    certificationCenterName,
    certificationCenterType,
    certificationCandidates,
    isOrganizationManagingStudents
  }: any) {
    this.id = id;
    this.date = date;
    this.time = time;
    this.address = address;
    this.room = room;
    this.examiner = examiner;
    this.certificationCenterName = certificationCenterName;
    this.certificationCenterType = certificationCenterType;
    this.certificationCandidates = certificationCandidates;
    this.isOrganizationManagingStudents = isOrganizationManagingStudents;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SessionForAttendanceSheet;
