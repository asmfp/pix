// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('../../infrastructure/utils/lodash-utils');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../models/AnswerStatus');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  match(answer: any, solution: any) {
    if (_.areCSVequivalent(answer, solution)) {
      return AnswerStatus.OK;
    }
    return AnswerStatus.KO;
  },
};
