// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function attachTargetProfilesToOrganization({
  organizationId,
  targetProfileIdsToAttach,
  targetProfileRepository,
  targetProfileShareRepository
}: any) {
  const uniqueTargetProfileIdsToAttach = _.uniq(targetProfileIdsToAttach);

  const foundTargetProfiles = await targetProfileRepository.findByIds(uniqueTargetProfileIdsToAttach);

  if (foundTargetProfiles.length !== uniqueTargetProfileIdsToAttach.length) {
    const foundTargetProfileIds = _.map(foundTargetProfiles, 'id');
    const [targetProfileIdNotExisting] = _.difference(uniqueTargetProfileIdsToAttach, foundTargetProfileIds);
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`Le profil cible ${targetProfileIdNotExisting} n'existe pas.`);
  }

  return targetProfileShareRepository.addTargetProfilesToOrganization({
    organizationId,
    targetProfileIdList: uniqueTargetProfileIdsToAttach,
  });
};
