// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../models/CampaignParticipationStatuses');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipationOverview {
  campaignCode: any;
  campaignTitle: any;
  createdAt: any;
  disabledAt: any;
  id: any;
  isShared: any;
  masteryRate: any;
  organizationName: any;
  sharedAt: any;
  status: any;
  targetProfile: any;
  targetProfileId: any;
  constructor({
    id,
    createdAt,
    sharedAt,
    organizationName,
    status,
    campaignCode,
    campaignTitle,
    campaignArchivedAt,
    deletedAt,
    targetProfile,
    masteryRate
  }: any = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.isShared = status === SHARED;
    this.sharedAt = sharedAt;
    this.targetProfileId = targetProfile?.id;
    this.organizationName = organizationName;
    this.status = status;
    this.campaignCode = campaignCode;
    this.campaignTitle = campaignTitle;
    this.targetProfile = targetProfile;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
    this.masteryRate = !_.isNil(masteryRate) ? Number(masteryRate) : null;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'filter' does not exist on type '{}'.
    const dates = [deletedAt, campaignArchivedAt].filter((a: any) => a != null);

    this.disabledAt = _.min(dates) || null;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get validatedStagesCount() {
    if (_.isEmpty(this.targetProfile?.stages) || !this.isShared) return null;

    const validatedStages = this._getReachableStages().filter((stage: any) => stage.threshold <= this.masteryRate * 100);
    return validatedStages.length;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get totalStagesCount() {
    return this._getReachableStages()?.length ?? 0;
  }

  _getReachableStages() {
    return this.targetProfile?.stages.filter((stage: any) => stage.threshold > 0);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipationOverview;
