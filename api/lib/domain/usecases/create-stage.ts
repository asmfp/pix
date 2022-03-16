// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const stageValidator = require('../validators/stage-validator');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function createStage({
  stage,
  stageRepository
}: any) {
  stageValidator.validate({ stage });

  return stageRepository.create(stage);
};
