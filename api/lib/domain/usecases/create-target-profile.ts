// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForCreation = require('../models/TargetProfileForCreation');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createTargetProfile({
  targetProfileData,
  targetProfileRepository,
  targetProfileWithLearningContentRepository
}: any) {
  const targetProfile = new TargetProfileForCreation(targetProfileData);
  const targetProfileId = await targetProfileRepository.create(targetProfile);
  return targetProfileWithLearningContentRepository.get({ id: targetProfileId });
};
