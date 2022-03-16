// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'types'.
const { types } = require('../models/Campaign');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignTo... Remove this comment to see the full error message
class CampaignToStartParticipation {
  archivedAt: any;
  assessmentMethod: any;
  id: any;
  idPixLabel: any;
  isRestricted: any;
  multipleSendings: any;
  organizationId: any;
  skillCount: any;
  type: any;
  constructor({
    id,
    idPixLabel,
    archivedAt,
    type,
    isRestricted,
    multipleSendings,
    assessmentMethod,
    skillCount,
    organizationId
  }: any = {}) {
    this.id = id;
    this.type = type;
    this.idPixLabel = idPixLabel;
    this.archivedAt = archivedAt;
    this.isRestricted = isRestricted;
    this.multipleSendings = multipleSendings;
    this.assessmentMethod = assessmentMethod;
    this.skillCount = skillCount;
    this.organizationId = organizationId;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isAssessment() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ASSESSMENT' does not exist on type '{ CE... Remove this comment to see the full error message
    return this.type === types.ASSESSMENT;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isArchived() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.archivedAt);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignToStartParticipation;
