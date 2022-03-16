// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findUserTutorials({
  tutorialEvaluationRepository,
  userTutorialRepository,
  userId
}: any = {}) {
  const tutorialEvaluations = await tutorialEvaluationRepository.find({ userId });
  const userSavedTutorialsWithTutorial = await userTutorialRepository.findWithTutorial({ userId });
  return userSavedTutorialsWithTutorial.map(_setTutorialEvaluation(tutorialEvaluations));
};

function _setTutorialEvaluation(tutorialEvaluations: any) {
  return (userSavedTutorial: any) => {
    const tutorialEvaluation = tutorialEvaluations.find(
      (tutorialEvaluation: any) => tutorialEvaluation.tutorialId === userSavedTutorial.tutorial.id
    );
    if (!tutorialEvaluation) return userSavedTutorial;
    return {
      ...userSavedTutorial,
      tutorial: {
        ...userSavedTutorial.tutorial,
        tutorialEvaluation,
      },
    };
  };
}
