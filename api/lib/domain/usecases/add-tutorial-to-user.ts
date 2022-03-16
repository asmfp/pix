// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function addTutorialToUser({
  tutorialRepository,
  skillRepository,
  userTutorialRepository,
  userId,
  tutorialId,
  skillId
}: any = {}) {
  await tutorialRepository.get(tutorialId);
  if (skillId != null) await skillRepository.get(skillId);

  return userTutorialRepository.addTutorial({ userId, tutorialId, skillId });
};
