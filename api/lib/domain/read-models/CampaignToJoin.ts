// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../models/Assessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'types'.
const { types } = require('../models/Campaign');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignTo... Remove this comment to see the full error message
class CampaignToJoin {
  alternativeTextToExternalIdHelpImage: any;
  archivedAt: any;
  assessmentMethod: any;
  code: any;
  customLandingPageText: any;
  customResultPageButtonText: any;
  customResultPageButtonUrl: any;
  customResultPageText: any;
  externalIdHelpImageUrl: any;
  id: any;
  idPixLabel: any;
  isForAbsoluteNovice: any;
  isRestricted: any;
  isSimplifiedAccess: any;
  multipleSendings: any;
  organizationFormNPSUrl: any;
  organizationId: any;
  organizationIsPoleEmploi: any;
  organizationLogoUrl: any;
  organizationName: any;
  organizationShowNPS: any;
  organizationType: any;
  targetProfileImageUrl: any;
  targetProfileName: any;
  title: any;
  type: any;
  constructor({
    id,
    code,
    title,
    idPixLabel,
    customLandingPageText,
    externalIdHelpImageUrl,
    alternativeTextToExternalIdHelpImage,
    archivedAt,
    type,
    isForAbsoluteNovice,
    organizationId,
    organizationName,
    organizationType,
    organizationLogoUrl,
    organizationIsManagingStudents,
    organizationIsPoleEmploi,
    organizationShowNPS,
    organizationFormNPSUrl,
    targetProfileName,
    targetProfileImageUrl,
    targetProfileIsSimplifiedAccess,
    customResultPageText,
    customResultPageButtonText,
    customResultPageButtonUrl,
    multipleSendings,
    assessmentMethod
  }: any = {}) {
    this.id = id;
    this.code = code;
    this.title = title;
    this.type = type;
    this.idPixLabel = idPixLabel;
    this.customLandingPageText = customLandingPageText;
    this.externalIdHelpImageUrl = externalIdHelpImageUrl;
    this.alternativeTextToExternalIdHelpImage = alternativeTextToExternalIdHelpImage;
    this.archivedAt = archivedAt;
    this.isRestricted = organizationIsManagingStudents;
    this.isSimplifiedAccess = targetProfileIsSimplifiedAccess;
    this.isForAbsoluteNovice = isForAbsoluteNovice;
    this.organizationId = organizationId;
    this.organizationName = organizationName;
    this.organizationType = organizationType;
    this.organizationLogoUrl = organizationLogoUrl;
    this.organizationIsPoleEmploi = organizationIsPoleEmploi;
    this.organizationShowNPS = organizationShowNPS;
    this.organizationFormNPSUrl = organizationFormNPSUrl;
    this.targetProfileName = targetProfileName;
    this.targetProfileImageUrl = targetProfileImageUrl;
    this.customResultPageText = customResultPageText;
    this.customResultPageButtonText = customResultPageButtonText;
    this.customResultPageButtonUrl = customResultPageButtonUrl;
    this.multipleSendings = multipleSendings;
    this.assessmentMethod = assessmentMethod;
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

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isFlash() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'methods' does not exist on type 'typeof ... Remove this comment to see the full error message
    return this.assessmentMethod === Assessment.methods.FLASH;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignToJoin;
