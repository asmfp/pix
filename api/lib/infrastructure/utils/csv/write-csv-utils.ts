// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { parseAsync } = require('json2csv');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CsvParsing... Remove this comment to see the full error message
const { CsvParsingError } = require('../../../../lib/domain/errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getCsvCont... Remove this comment to see the full error message
async function getCsvContent({
  data,
  delimiter = ';',
  eol = '\n',
  fileHeaders,
  withBOM = true
}: any) {
  try {
    const options = { delimiter, eol, fields: fileHeaders, withBOM };
    const csvContent = await parseAsync(data, options);
    return csvContent;
  } catch (err) {
    throw new CsvParsingError();
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getCsvContent,
};
