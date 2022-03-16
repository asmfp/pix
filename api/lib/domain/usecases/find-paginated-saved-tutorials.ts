// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findPaginatedSavedTutorials({
  tutorialEvaluationRepository,
  tutorialRepository,
  userId,
  page
}: any = {}) {
  const tutorialEvaluations = await tutorialEvaluationRepository.find({ userId });
  const { models: tutorialWithUserSavedTutorial, meta } =
    await tutorialRepository.findPaginatedWithUserTutorialForCurrentUser({
      userId,
      page,
    });
  const savedTutorials = tutorialWithUserSavedTutorial.map(_setTutorialEvaluation(tutorialEvaluations));
  return {
    results: savedTutorials,
    meta,
  };
};

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _setTutorialEvaluation(tutorialEvaluations: any) {
  return (tutorialWithUserSavedTutorial: any) => {
    const tutorialEvaluation = tutorialEvaluations.find(
      (tutorialEvaluation: any) => tutorialEvaluation.tutorialId === tutorialWithUserSavedTutorial.id
    );
    if (!tutorialEvaluation) return tutorialWithUserSavedTutorial;
    return {
      ...tutorialWithUserSavedTutorial,
      tutorialEvaluation,
    };
  };
}
