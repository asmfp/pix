// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateTargetProfile({
  id,
  name,
  description,
  comment,
  category,
  targetProfileForUpdateRepository
}: any) {
  const targetProfileForUpdate = await targetProfileForUpdateRepository.get(id);
  targetProfileForUpdate.update({ name, description, comment, category });
  await targetProfileForUpdateRepository.update(targetProfileForUpdate);
};
