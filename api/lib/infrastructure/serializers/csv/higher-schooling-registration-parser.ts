// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'HigherScho... Remove this comment to see the full error message
const HigherSchoolingRegistrationSet = require('../../../../lib/domain/models/HigherSchoolingRegistrationSet');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CsvImportE... Remove this comment to see the full error message
const { CsvImportError } = require('../../../../lib/domain/errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CsvRegistr... Remove this comment to see the full error message
const { CsvRegistrationParser } = require('./csv-registration-parser');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'HigherScho... Remove this comment to see the full error message
const HigherSchoolingRegistrationColumns = require('./higher-schooling-registration-columns');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  STUDENT_NUMBER_UNIQUE: 'STUDENT_NUMBER_UNIQUE',
  STUDENT_NUMBER_FORMAT: 'STUDENT_NUMBER_FORMAT',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'HigherScho... Remove this comment to see the full error message
class HigherSchoolingRegistrationParser extends CsvRegistrationParser {
  constructor(input: any, organizationId: any, i18n: any) {
    const registrationSet = new HigherSchoolingRegistrationSet(i18n);

    const columns = new HigherSchoolingRegistrationColumns(i18n).columns;

    super(input, organizationId, columns, registrationSet);
  }

  _handleError(err: any, index: any) {
    const column = this._columns.find((column: any) => column.name === err.key);
    const line = index + 2;
    const field = column.label;
    if (err.why === 'uniqueness') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'STUDENT_NUMBER_UNIQUE' does not exist on... Remove this comment to see the full error message
      throw new CsvImportError(ERRORS.STUDENT_NUMBER_UNIQUE, { line, field });
    }
    if (err.why === 'student_number_format') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'STUDENT_NUMBER_FORMAT' does not exist on... Remove this comment to see the full error message
      throw new CsvImportError(ERRORS.STUDENT_NUMBER_FORMAT, { line, field });
    }
    // @ts-expect-error ts-migrate(2556) FIXME: Expected 2 arguments, but got 0 or more.
    super._handleError(...arguments);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = HigherSchoolingRegistrationParser;
