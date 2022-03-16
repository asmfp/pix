// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionJur... Remove this comment to see the full error message
const SessionJuryComment = require('../../../domain/models/SessionJuryComment');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(sessionId: any) {
    const result = await knex
      .select({
        id: 'id',
        comment: 'juryComment',
        authorId: 'juryCommentAuthorId',
        updatedAt: 'juryCommentedAt',
      })
      .from('sessions')
      .where({ id: sessionId })
      .first();

    if (!result) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`La session ${sessionId} n'existe pas ou son accès est restreint.`);
    }

    return new SessionJuryComment(result);
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async save(sessionJuryComment: any) {
    const columnsToSave = {
      juryComment: sessionJuryComment.comment,
      juryCommentAuthorId: sessionJuryComment.authorId,
      juryCommentedAt: sessionJuryComment.updatedAt,
    };
    await _persist(sessionJuryComment.id, columnsToSave);
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async delete(sessionJuryCommentId: any) {
    const columnsToSave = {
      // @ts-expect-error ts-migrate(7018) FIXME: Object literal's property 'juryComment' implicitly... Remove this comment to see the full error message
      juryComment: null,
      // @ts-expect-error ts-migrate(7018) FIXME: Object literal's property 'juryCommentAuthorId' im... Remove this comment to see the full error message
      juryCommentAuthorId: null,
      // @ts-expect-error ts-migrate(7018) FIXME: Object literal's property 'juryCommentedAt' implic... Remove this comment to see the full error message
      juryCommentedAt: null,
    };
    await _persist(sessionJuryCommentId, columnsToSave);
  },
};

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _persist(sessionId: any, columnsToSave: any) {
  const updatedSessionIds = await knex('sessions').update(columnsToSave).where({ id: sessionId }).returning('id');

  if (updatedSessionIds.length === 0) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`La session ${sessionId} n'existe pas ou son accès est restreint.`);
  }
}
