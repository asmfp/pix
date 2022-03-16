// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionJur... Remove this comment to see the full error message
class SessionJuryComment {
  authorId: any;
  comment: any;
  id: any;
  updatedAt: any;
  constructor({
    id,
    comment,
    authorId,
    updatedAt
  }: any) {
    this.id = id;
    this.comment = comment;
    this.authorId = authorId;
    this.updatedAt = updatedAt;
  }

  update({
    comment,
    authorId
  }: any) {
    this.comment = comment;
    this.authorId = authorId;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    this.updatedAt = new Date();
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SessionJuryComment;
