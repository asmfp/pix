// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment-timezone');

moment.parseTwoDigitYear = function (yearString: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
  const year = parseInt(yearString);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  const currentYear = new Date().getFullYear();
  return 2000 + year < currentYear ? 2000 + year : 1900 + year;
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isValidDat... Remove this comment to see the full error message
function isValidDate(dateValue: any, format: any) {
  return moment.utc(dateValue, format, true).isValid();
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'convertDat... Remove this comment to see the full error message
function convertDateValue({
  dateString,
  inputFormat,
  alternativeInputFormat = null,
  outputFormat
}: any) {
  if (isValidDate(dateString, inputFormat)) {
    return moment(dateString, inputFormat, true).format(outputFormat);
  } else if (alternativeInputFormat && isValidDate(dateString, alternativeInputFormat)) {
    return moment(dateString, alternativeInputFormat, true).format(outputFormat);
  }
  return null;
}

function getNowDate() {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  return new Date();
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  isValidDate,
  convertDateValue,
  getNowDate,
};
