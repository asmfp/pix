// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'levenshtei... Remove this comment to see the full error message
const levenshtein = require('fast-levenshtein');

function getLevenshteinRatio(inputString: any, reference: any) {
  return levenshtein.get(inputString, reference) / inputString.length;
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'areTwoStri... Remove this comment to see the full error message
function areTwoStringsCloseEnough(inputString: any, reference: any, MAX_ACCEPTABLE_RATIO: any) {
  return getLevenshteinRatio(inputString, reference) <= MAX_ACCEPTABLE_RATIO;
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isOneStrin... Remove this comment to see the full error message
function isOneStringCloseEnoughFromMultipleStrings(inputString: any, references: any, MAX_ACCEPTABLE_RATIO: any) {
  return getSmallestLevenshteinRatio(inputString, references) <= MAX_ACCEPTABLE_RATIO;
}

function getSmallestLevenshteinRatio(inputString: any, references: any) {
  return getSmallestLevenshteinDistance(inputString, references) / inputString.length;
}

function getSmallestLevenshteinDistance(comparative: any, alternatives: any) {
  const getLevenshteinDistance = (alternative: any) => levenshtein.get(comparative, alternative);
  return _(alternatives).map(getLevenshteinDistance).min();
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  areTwoStringsCloseEnough,
  isOneStringCloseEnoughFromMultipleStrings,
  getSmallestLevenshteinDistance,
  getSmallestLevenshteinRatio,
  getLevenshteinRatio,
};
