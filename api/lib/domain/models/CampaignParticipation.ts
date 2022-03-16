// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ArchivedCa... Remove this comment to see the full error message
  ArchivedCampaignError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
  AssessmentNotCompletedError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadySha... Remove this comment to see the full error message
  AlreadySharedCampaignParticipationError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CantImprov... Remove this comment to see the full error message
  CantImproveCampaignParticipationError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
  CampaignParticipationDeletedError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('./CampaignParticipationStatuses');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipation {
  assessments: any;
  campaign: any;
  createdAt: any;
  deletedAt: any;
  id: any;
  participantExternalId: any;
  pixScore: any;
  schoolingRegistrationId: any;
  sharedAt: any;
  status: any;
  user: any;
  userId: any;
  validatedSkillsCount: any;
  constructor({
    id,
    createdAt,
    participantExternalId,
    status,
    sharedAt,
    deletedAt,
    assessments,
    campaign,
    user,
    userId,
    validatedSkillsCount,
    pixScore,
    schoolingRegistrationId
  }: any = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.status = status;
    this.participantExternalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.deletedAt = deletedAt;
    this.campaign = campaign;
    this.user = user;
    this.assessments = assessments;
    this.userId = userId;
    this.status = status;
    this.validatedSkillsCount = validatedSkillsCount;
    this.pixScore = pixScore;
    this.schoolingRegistrationId = schoolingRegistrationId;
  }

  static start(campaignParticipation: any) {
    const { schoolingRegistrationId = null } = campaignParticipation;
    const { isAssessment } = campaignParticipation.campaign;
    const { STARTED, TO_SHARE } = CampaignParticipationStatuses;

    const status = isAssessment ? STARTED : TO_SHARE;

    return new CampaignParticipation({
      ...campaignParticipation,
      status,
      schoolingRegistrationId,
    });
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isShared() {
    return this.status === CampaignParticipationStatuses.SHARED;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isDeleted() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.deletedAt);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get lastAssessment() {
    return _.maxBy(this.assessments, 'createdAt');
  }

  getTargetProfileId() {
    return _.get(this, 'campaign.targetProfileId', null);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get campaignId() {
    return _.get(this, 'campaign.id', null);
  }

  share() {
    this._canBeShared();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    this.sharedAt = new Date();
    this.status = CampaignParticipationStatuses.SHARED;
  }

  improve() {
    this._canBeImproved();
    this.status = CampaignParticipationStatuses.STARTED;
  }

  _canBeImproved() {
    if (this.campaign.isProfilesCollection()) {
      throw new CantImproveCampaignParticipationError();
    }
  }

  _canBeShared() {
    if (this.isShared) {
      throw new AlreadySharedCampaignParticipationError();
    }
    if (this.campaign.isArchived()) {
      throw new ArchivedCampaignError('Cannot share results on an archived campaign.');
    }
    if (this.isDeleted) {
      throw new CampaignParticipationDeletedError('Cannot share results on a deleted participation.');
    }
    if (this.campaign.isAssessment() && lastAssessmentNotCompleted(this)) {
      throw new AssessmentNotCompletedError();
    }
  }
}

function lastAssessmentNotCompleted(campaignParticipation: any) {
  return !campaignParticipation.lastAssessment || !campaignParticipation.lastAssessment.isCompleted();
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipation;
