// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
class ComplementaryCertificationCourse {
  certificationCourseId: any;
  complementaryCertificationId: any;
  constructor({
    complementaryCertificationId,
    certificationCourseId
  }: any) {
    this.complementaryCertificationId = complementaryCertificationId;
    this.certificationCourseId = certificationCourseId;
  }

  static fromComplementaryCertificationId(id: any) {
    return new ComplementaryCertificationCourse({
      complementaryCertificationId: id,
    });
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ComplementaryCertificationCourse;
