// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function commentSessionAsJury({
  sessionId,
  juryComment,
  juryCommentAuthorId,
  sessionJuryCommentRepository
}: any) {
  const sessionJuryComment = await sessionJuryCommentRepository.get(sessionId);

  sessionJuryComment.update({
    comment: juryComment,
    authorId: juryCommentAuthorId,
  });

  await sessionJuryCommentRepository.save(sessionJuryComment);
};
