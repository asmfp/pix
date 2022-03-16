// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
class ParticipationForCampaignManagement {
  createdAt: any;
  firstName: any;
  id: any;
  lastName: any;
  participantExternalId: any;
  sharedAt: any;
  status: any;
  constructor({
    id,
    lastName,
    firstName,
    participantExternalId,
    status,
    createdAt,
    sharedAt
  }: any = {}) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.participantExternalId = participantExternalId;
    this.status = status;
    this.createdAt = createdAt;
    this.sharedAt = sharedAt;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ParticipationForCampaignManagement;
