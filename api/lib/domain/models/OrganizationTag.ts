// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationTag {
  id: any;
  organizationId: any;
  tagId: any;
  constructor({
    id,
    organizationId,
    tagId
  }: any = {}) {
    this.id = id;
    this.organizationId = organizationId;
    this.tagId = tagId;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationTag;
