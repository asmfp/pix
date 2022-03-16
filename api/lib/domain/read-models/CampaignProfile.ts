// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfileCompetence = require('./CampaignProfileCompetence');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../models/CampaignParticipationStatuses');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
class CampaignProfile {
  campaignId: any;
  campaignParticipationId: any;
  createdAt: any;
  externalId: any;
  firstName: any;
  isShared: any;
  lastName: any;
  pixScore: any;
  placementProfile: any;
  sharedAt: any;
  constructor({
    firstName,
    lastName,
    placementProfile,
    campaignParticipationId,
    campaignId,
    participantExternalId,
    sharedAt,
    status,
    createdAt,
    pixScore
  }: any) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.campaignParticipationId = campaignParticipationId;
    this.campaignId = campaignId;
    this.externalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.isShared = status === SHARED;
    this.createdAt = createdAt;
    this.placementProfile = placementProfile;
    this.pixScore = pixScore;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isCertifiable() {
    if (this.isShared) {
      return this.placementProfile.isCertifiable();
    }
    return null;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get certifiableCompetencesCount() {
    if (this.isShared) {
      return this.placementProfile.getCertifiableCompetencesCount();
    }
    return null;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get competencesCount() {
    if (this.isShared) {
      return this.placementProfile.getCompetencesCount();
    }
    return null;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get competences() {
    if (this.isShared) {
      return this.placementProfile.userCompetences.map((competence: any) => {
        return new CampaignProfileCompetence(competence);
      });
    }
    return [];
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignProfile;
