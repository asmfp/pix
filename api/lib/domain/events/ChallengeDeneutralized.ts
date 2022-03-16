// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ChallengeD... Remove this comment to see the full error message
class ChallengeDeneutralized {
  certificationCourseId: any;
  juryId: any;
  constructor({
    certificationCourseId,
    juryId
  }: any) {
    this.certificationCourseId = certificationCourseId;
    this.juryId = juryId;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ChallengeDeneutralized;
