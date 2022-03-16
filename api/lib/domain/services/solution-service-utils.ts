// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('../../../lib/infrastructure/utils/lodash-utils');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { normalizeAndRemoveAccents: t1, removeSpecialCharacters: t2 } = require('./validation-treatments');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { getSmallestLevenshteinRatio: t3 } = require('./string-comparison-service');

function treatmentT1T2T3(userAnswer: any, adminAnswers: any, applyTreatments = true) {
  if (_.isNotArrayOfString(adminAnswers)) return null;
  if (_.isNotString(userAnswer)) return null;
  if (_.isEmpty(adminAnswers)) return null;
  if (applyTreatments) {
    return {
      userAnswer: userAnswer,
      adminAnswers: adminAnswers,
      t1: t1(userAnswer),
      t1t2: t2(t1(userAnswer)),
      t2: t2(userAnswer),
      t1t3Ratio: t3(t1(userAnswer), adminAnswers),
      t2t3Ratio: t3(t2(userAnswer), adminAnswers),
      t1t2t3Ratio: t3(t2(t1(userAnswer)), adminAnswers),
      t3Ratio: t3(userAnswer, adminAnswers),
    };
  } else {
    const t3Ratio = adminAnswers.includes(userAnswer) ? 0 : 1;
    return {
      userAnswer: userAnswer,
      adminAnswers: adminAnswers,
      t1: userAnswer,
      t1t2: userAnswer,
      t2: userAnswer,
      t1t3Ratio: t3Ratio,
      t2t3Ratio: t3Ratio,
      t1t2t3Ratio: t3Ratio,
      t3Ratio: t3Ratio,
    };
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  treatmentT1T2T3,
};
