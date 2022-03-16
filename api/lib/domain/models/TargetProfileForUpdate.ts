// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validate'.
const { validate } = require('../validators/target-profile/base-validation');
class TargetProfileForUpdate {
  category: any;
  comment: any;
  description: any;
  id: any;
  name: any;
  constructor({
    id,
    name,
    description,
    comment,
    category
  }: any) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.comment = comment;
    this.category = category;
  }

  update({
    name,
    description,
    comment,
    category
  }: any) {
    this.name = name;
    this.description = description;
    this.comment = comment;
    this.category = category;
    validate(this);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetProfileForUpdate;
