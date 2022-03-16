// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('./OrganizationInvitation');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationToArchive {
  archiveDate: any;
  archivedBy: any;
  id: any;
  newInvitationStatus: any;
  previousInvitationStatus: any;
  constructor({
    id
  }: any = {}) {
    this.id = id;
  }

  archive({
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    archiveDate = new Date(),
    archivedBy
  }: any = {}) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'StatusType' does not exist on type 'type... Remove this comment to see the full error message
    this.previousInvitationStatus = OrganizationInvitation.StatusType.PENDING;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'StatusType' does not exist on type 'type... Remove this comment to see the full error message
    this.newInvitationStatus = OrganizationInvitation.StatusType.CANCELLED;
    this.archiveDate = archiveDate;
    this.archivedBy = archivedBy;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationToArchive;
