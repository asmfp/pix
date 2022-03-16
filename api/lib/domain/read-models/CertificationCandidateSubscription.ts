// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class CertificationCandidateSubscription {
  eligibleSubscriptions: any;
  id: any;
  nonEligibleSubscriptions: any;
  sessionId: any;
  constructor({
    id,
    sessionId,
    eligibleSubscriptions,
    nonEligibleSubscriptions
  }: any) {
    this.id = id;
    this.sessionId = sessionId;
    this.eligibleSubscriptions = eligibleSubscriptions;
    this.nonEligibleSubscriptions = nonEligibleSubscriptions;
  }
};
