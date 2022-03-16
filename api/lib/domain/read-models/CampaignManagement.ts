// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignMa... Remove this comment to see the full error message
class CampaignManagement {
  archivedAt: any;
  code: any;
  createdAt: any;
  creatorFirstName: any;
  creatorId: any;
  creatorLastName: any;
  customLandingPageText: any;
  customResultPageButtonText: any;
  customResultPageButtonUrl: any;
  customResultPageText: any;
  id: any;
  idPixLabel: any;
  multipleSendings: any;
  name: any;
  organizationId: any;
  organizationName: any;
  ownerFirstName: any;
  ownerId: any;
  ownerLastName: any;
  sharedParticipationsCount: any;
  targetProfileId: any;
  targetProfileName: any;
  title: any;
  totalParticipationsCount: any;
  type: any;
  constructor({
    id,
    code,
    name,
    idPixLabel,
    createdAt,
    archivedAt,
    type,
    creatorLastName,
    creatorFirstName,
    creatorId,
    organizationId,
    organizationName,
    targetProfileId,
    targetProfileName,
    title,
    customLandingPageText,
    customResultPageText,
    customResultPageButtonText,
    customResultPageButtonUrl,
    ownerLastName,
    ownerFirstName,
    ownerId,
    shared,
    started,
    completed,
    multipleSendings
  }: any = {}) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.type = type;
    this.idPixLabel = idPixLabel;
    this.createdAt = createdAt;
    this.archivedAt = archivedAt;
    this.creatorLastName = creatorLastName;
    this.creatorFirstName = creatorFirstName;
    this.creatorId = creatorId;
    this.organizationId = organizationId;
    this.organizationName = organizationName;
    this.targetProfileId = targetProfileId;
    this.targetProfileName = targetProfileName;
    this.title = title;
    this.customLandingPageText = customLandingPageText;
    this.customResultPageText = customResultPageText;
    this.customResultPageButtonText = customResultPageButtonText;
    this.customResultPageButtonUrl = customResultPageButtonUrl;
    this.ownerLastName = ownerLastName;
    this.ownerFirstName = ownerFirstName;
    this.ownerId = ownerId;
    this.sharedParticipationsCount = shared;
    this.totalParticipationsCount = this.sharedParticipationsCount + (started || 0) + completed;
    this.multipleSendings = multipleSendings;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isTypeProfilesCollection() {
    return this.type === 'PROFILES_COLLECTION';
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isTypeAssessment() {
    return this.type === 'ASSESSMENT';
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignManagement;
