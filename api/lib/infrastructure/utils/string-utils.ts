// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('../../infrastructure/utils/lodash-utils');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getArrayOf... Remove this comment to see the full error message
function getArrayOfStrings(commaSeparatedStrings: any) {
  if (!commaSeparatedStrings) return [];
  return _(commaSeparatedStrings).split(',').map(_.trim).map(_.toUpper).value();
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isNumeric'... Remove this comment to see the full error message
function isNumeric(string: any) {
  if (typeof string != 'string') {
    return false;
  }
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'replace' does not exist on type 'string'... Remove this comment to see the full error message
  const stringWithoutComma = string.replace(',', '.').trim();
  const stringWithoutCommaAndSpace = stringWithoutComma.replace(' ', '');
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'isNaN'.
  return !isNaN(stringWithoutCommaAndSpace) && !isNaN(parseFloat(stringWithoutCommaAndSpace));
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cleanStrin... Remove this comment to see the full error message
function cleanStringAndParseFloat(string: any) {
  const stringWithoutSpace = string.replace(' ', '');
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseFloat'.
  return parseFloat(stringWithoutSpace.replace(',', '.'));
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'splitIntoW... Remove this comment to see the full error message
function splitIntoWordsAndRemoveBackspaces(string: any) {
  return _.chain(string).split('\n').reject(_.isEmpty).value();
}

/**
 * Normalize and uppercase a string, remove non canonical characters, zero-width characters and sort the remaining characters alphabetically
 * @param {string} str
 * @returns {string}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'normalizeA... Remove this comment to see the full error message
function normalizeAndSortChars(str: any) {
  const normalizedName = normalize(str);
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'sort' does not exist on type '{}'.
  return [...normalizedName].sort().join('');
}

/**
 * Normalize and uppercase a string, remove non canonical characters and zero-width characters
 * @param {string} str
 * @returns {string}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'normalize'... Remove this comment to see the full error message
function normalize(str: any) {
  const strCanonical = _removeNonCanonicalChars(str);
  const strUpper = strCanonical.toUpperCase();
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'filter' does not exist on type '{}'.
  return [...strUpper].filter((char: any) => Boolean(char.match(/[0-9A-Z]/))).join('');
}

function _removeNonCanonicalChars(str: any) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'toArrayOfF... Remove this comment to see the full error message
function toArrayOfFixedLengthStringsConservingWords(str: any, maxLength: any) {
  const result: any = [];
  const words = str.split(' ');
  let index = 0;
  words.forEach((word: any) => {
    if (!result[index]) {
      result[index] = '';
    }
    if (result[index].length + word.length <= maxLength) {
      result[index] += `${word} `;
    } else {
      index++;
      result[index] = `${word} `;
    }
  });
  return result.map((str: any) => str.trim());
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  isNumeric,
  splitIntoWordsAndRemoveBackspaces,
  cleanStringAndParseFloat,
  getArrayOfStrings,
  normalizeAndSortChars,
  normalize,
  toArrayOfFixedLengthStringsConservingWords,
};
