// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validate'.
const validate = require('../validators/campaign-creation-validator');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignFo... Remove this comment to see the full error message
class CampaignForCreation {
  code: any;
  creatorId: any;
  customLandingPageText: any;
  idPixLabel: any;
  multipleSendings: any;
  name: any;
  organizationId: any;
  ownerId: any;
  targetProfileId: any;
  title: any;
  type: any;
  constructor({
    name,
    title,
    idPixLabel,
    customLandingPageText,
    type,
    targetProfileId,
    creatorId,
    ownerId,
    organizationId,
    multipleSendings,
    code
  }: any = {}) {
    this.name = name;
    this.title = title;
    this.idPixLabel = idPixLabel;
    this.customLandingPageText = customLandingPageText;
    this.type = type;
    this.targetProfileId = targetProfileId;
    this.creatorId = creatorId;
    this.ownerId = ownerId;
    this.organizationId = organizationId;
    this.multipleSendings = multipleSendings;
    this.code = code;
    validate(this);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignForCreation;
