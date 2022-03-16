// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserWithAc... Remove this comment to see the full error message
class UserWithActivity {
  codeForLastProfileToShare: any;
  hasAssessmentParticipations: any;
  constructor({
    user,
    hasAssessmentParticipations,
    codeForLastProfileToShare
  }: any) {
    this.hasAssessmentParticipations = hasAssessmentParticipations;
    this.codeForLastProfileToShare = codeForLastProfileToShare;
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Object'. Did you mean 'isObject'... Remove this comment to see the full error message
    Object.assign(this, user);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserWithActivity;
