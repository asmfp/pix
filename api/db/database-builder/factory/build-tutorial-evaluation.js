const databaseBuffer = require('../database-buffer');

module.exports = function buildTutorialEvaluation({ id = databaseBuffer.getNextId(), tutorialId, userId } = {}) {
  return databaseBuffer.pushInsertable({
    tableName: 'tutorial-evaluations',
    values: {
      id,
      userId,
      tutorialId,
    },
  });
};
