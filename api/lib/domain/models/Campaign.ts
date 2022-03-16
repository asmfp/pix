// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'types'.
const types = {
  ASSESSMENT: 'ASSESSMENT',
  PROFILES_COLLECTION: 'PROFILES_COLLECTION',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Campaign'.
class Campaign {
  alternativeTextToExternalIdHelpImage: any;
  archivedAt: any;
  assessmentMethod: any;
  code: any;
  createdAt: any;
  creator: any;
  customLandingPageText: any;
  customResultPageButtonText: any;
  customResultPageButtonUrl: any;
  customResultPageText: any;
  externalIdHelpImageUrl: any;
  id: any;
  idPixLabel: any;
  isForAbsoluteNovice: any;
  multipleSendings: any;
  name: any;
  organization: any;
  ownerId: any;
  targetProfile: any;
  title: any;
  type: any;
  constructor({
    id,
    name,
    code,
    title,
    idPixLabel,
    externalIdHelpImageUrl,
    alternativeTextToExternalIdHelpImage,
    createdAt,
    customLandingPageText,
    archivedAt,
    type,
    isForAbsoluteNovice,
    targetProfile,
    creator,
    ownerId,
    organization,
    customResultPageText,
    customResultPageButtonText,
    customResultPageButtonUrl,
    multipleSendings,
    assessmentMethod
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.title = title;
    this.idPixLabel = idPixLabel;
    this.externalIdHelpImageUrl = externalIdHelpImageUrl;
    this.alternativeTextToExternalIdHelpImage = alternativeTextToExternalIdHelpImage;
    this.createdAt = createdAt;
    this.customLandingPageText = customLandingPageText;
    this.archivedAt = archivedAt;
    this.type = type;
    this.isForAbsoluteNovice = isForAbsoluteNovice;
    this.targetProfile = targetProfile;
    this.creator = creator;
    this.ownerId = ownerId;
    this.organization = organization;
    this.customResultPageText = customResultPageText;
    this.customResultPageButtonText = customResultPageButtonText;
    this.customResultPageButtonUrl = customResultPageButtonUrl;
    this.multipleSendings = multipleSendings;
    this.assessmentMethod = assessmentMethod;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get organizationId() {
    return _.get(this, 'organization.id', null);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get targetProfileId() {
    return _.get(this, 'targetProfile.id', null);
  }

  isAssessment() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ASSESSMENT' does not exist on type '{ CE... Remove this comment to see the full error message
    return this.type === types.ASSESSMENT;
  }

  isProfilesCollection() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PROFILES_COLLECTION' does not exist on t... Remove this comment to see the full error message
    return this.type === types.PROFILES_COLLECTION;
  }

  isArchived() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.archivedAt);
  }
}

Campaign.types = types;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Campaign;
