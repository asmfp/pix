// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
class CampaignProfilesCollectionParticipationSummary {
  certifiable: any;
  certifiableCompetencesCount: any;
  firstName: any;
  id: any;
  lastName: any;
  participantExternalId: any;
  pixScore: any;
  sharedAt: any;
  constructor({
    campaignParticipationId,
    firstName,
    lastName,
    participantExternalId,
    sharedAt,
    pixScore,
    certifiable,
    certifiableCompetencesCount
  }: any) {
    this.id = campaignParticipationId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.participantExternalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.pixScore = pixScore;
    this.certifiable = certifiable;
    this.certifiableCompetencesCount = certifiableCompetencesCount;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignProfilesCollectionParticipationSummary;
