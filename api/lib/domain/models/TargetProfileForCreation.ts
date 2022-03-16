// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validate'.
const { validate } = require('../validators/target-profile/creation-validation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('./TargetProfile');
const DEFAULT_IMAGE_URL = 'https://images.pix.fr/profil-cible/Illu_GEN.svg';

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
class TargetProfileForCreation {
  category: any;
  comment: any;
  description: any;
  imageUrl: any;
  isPublic: any;
  name: any;
  ownerOrganizationId: any;
  skillIds: any;
  constructor({
    name,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'categories' does not exist on type 'type... Remove this comment to see the full error message
    category = TargetProfile.categories.OTHER,
    skillIds,
    description,
    comment,
    isPublic,
    imageUrl = DEFAULT_IMAGE_URL,
    ownerOrganizationId
  }: any) {
    this.name = name;
    this.category = category;
    this.skillIds = skillIds;
    this.description = description;
    this.comment = comment;
    this.isPublic = isPublic;
    this.imageUrl = imageUrl;
    this.ownerOrganizationId = ownerOrganizationId;
    validate(this);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetProfileForCreation;
