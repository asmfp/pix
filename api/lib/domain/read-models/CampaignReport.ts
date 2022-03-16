// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'types'.
const { types } = require('../models/Campaign');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignRe... Remove this comment to see the full error message
class CampaignReport {
  archivedAt: any;
  averageResult: any;
  badges: any;
  code: any;
  createdAt: any;
  customLandingPageText: any;
  id: any;
  idPixLabel: any;
  multipleSendings: any;
  name: any;
  ownerFirstName: any;
  ownerId: any;
  ownerLastName: any;
  participationsCount: any;
  sharedParticipationsCount: any;
  stages: any;
  targetProfileDescription: any;
  targetProfileHasStage: any;
  targetProfileId: any;
  targetProfileName: any;
  targetProfileThematicResultCount: any;
  targetProfileTubesCount: any;
  title: any;
  type: any;
  constructor({
    id,
    name,
    code,
    title,
    idPixLabel,
    createdAt,
    customLandingPageText,
    archivedAt,
    type,
    ownerId,
    ownerLastName,
    ownerFirstName,
    targetProfileForSpecifier = {},
    participationsCount,
    sharedParticipationsCount,
    averageResult,
    badges = [],
    stages = [],
    multipleSendings
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.title = title;
    this.type = type;
    this.idPixLabel = idPixLabel;
    this.customLandingPageText = customLandingPageText;
    this.createdAt = createdAt;
    this.archivedAt = archivedAt;
    this.ownerId = ownerId;
    this.ownerLastName = ownerLastName;
    this.ownerFirstName = ownerFirstName;
    this.participationsCount = participationsCount;
    this.sharedParticipationsCount = sharedParticipationsCount;
    this.averageResult = averageResult;
    this.badges = badges;
    this.stages = stages;
    this.multipleSendings = multipleSendings;

    this.targetProfileId = targetProfileForSpecifier.id;
    this.targetProfileDescription = targetProfileForSpecifier.description;
    this.targetProfileName = targetProfileForSpecifier.name;
    this.targetProfileTubesCount = targetProfileForSpecifier.tubeCount;
    this.targetProfileThematicResultCount = targetProfileForSpecifier.thematicResultCount;
    this.targetProfileHasStage = targetProfileForSpecifier.hasStage;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isAssessment() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ASSESSMENT' does not exist on type '{ CE... Remove this comment to see the full error message
    return this.type === types.ASSESSMENT;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isProfilesCollection() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PROFILES_COLLECTION' does not exist on t... Remove this comment to see the full error message
    return this.type === types.PROFILES_COLLECTION;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isArchived() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.archivedAt);
  }

  computeAverageResult(masteryRates: any) {
    const totalMasteryRates = masteryRates.length;
    if (totalMasteryRates > 0) {
      this.averageResult = _.sum(masteryRates) / totalMasteryRates;
    } else this.averageResult = null;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignReport;
