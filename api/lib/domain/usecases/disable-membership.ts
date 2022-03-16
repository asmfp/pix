// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function disableMembership({
  membershipId,
  userId,
  membershipRepository
}: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  const membership = { disabledAt: new Date(), updatedByUserId: userId };
  return membershipRepository.updateById({ id: membershipId, membership });
};
