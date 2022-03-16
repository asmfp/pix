// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const papa = require('papaparse');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'iconv'.
const iconv = require('iconv-lite');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'convertDat... Remove this comment to see the full error message
const { convertDateValue } = require('../../utils/date-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CsvImportE... Remove this comment to see the full error message
const { CsvImportError } = require('../../../../lib/domain/errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  ENCODING_NOT_SUPPORTED: 'ENCODING_NOT_SUPPORTED',
  BAD_CSV_FORMAT: 'BAD_CSV_FORMAT',
  HEADER_REQUIRED: 'HEADER_REQUIRED',
  HEADER_UNKNOWN: 'HEADER_UNKNOWN',
  FIELD_MIN_LENGTH: 'FIELD_MIN_LENGTH',
  FIELD_MAX_LENGTH: 'FIELD_MAX_LENGTH',
  FIELD_LENGTH: 'FIELD_LENGTH',
  FIELD_DATE_FORMAT: 'FIELD_DATE_FORMAT',
  FIELD_EMAIL_FORMAT: 'FIELD_EMAIL_FORMAT',
  FIELD_REQUIRED: 'FIELD_REQUIRED',
  FIELD_BAD_VALUES: 'FIELD_BAD_VALUES',
};

const PARSING_OPTIONS = {
  header: true,
  skipEmptyLines: 'greedy',
  transform: (value: any) => {
    if (typeof value === 'string') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'trim' does not exist on type 'string'.
      value = value.trim();
      return value.length ? value : undefined;
    }
    return value;
  },
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CsvColumn'... Remove this comment to see the full error message
class CsvColumn {
  checkEncoding: any;
  isDate: any;
  isRequired: any;
  label: any;
  name: any;
  constructor({
    name,
    label,
    isRequired = false,
    isDate = false,
    checkEncoding = false
  }: any) {
    this.name = name;
    this.label = label;
    this.isRequired = isRequired;
    this.isDate = isDate;
    this.checkEncoding = checkEncoding;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CsvRegistr... Remove this comment to see the full error message
class CsvRegistrationParser {
  _columns: any;
  _input: any;
  _organizationId: any;
  registrationSet: any;
  constructor(input: any, organizationId: any, columns: any, registrationSet: any) {
    this._input = input;
    this._organizationId = organizationId;
    this._columns = columns;
    this.registrationSet = registrationSet;
  }

  parse() {
    const encoding = this._getFileEncoding();
    const { registrationLines, fields } = this._parse(encoding);

    if (!encoding) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new CsvImportError(ERRORS.ENCODING_NOT_SUPPORTED);
    }

    this._checkColumns(fields);
    registrationLines.forEach((line: any, index: any) => {
      const registrationAttributes = this._lineToRegistrationAttributes(line);
      try {
        this.registrationSet.addRegistration(registrationAttributes);
      } catch (err) {
        this._handleError(err, index);
      }
    });
    return this.registrationSet;
  }

  /**
   * Identify which encoding has the given file.
   * To check it, we decode and parse the first line of the file with supported encodings.
   * If there is one with at least "First name" or "Student number" correctly parsed and decoded.
   */
  _getFileEncoding() {
    const supported_encodings = ['utf-8', 'win1252', 'macintosh'];
    const checkedColumns = this._getEncodingColumns();
    for (const encoding of supported_encodings) {
      const decodedInput = iconv.decode(this._input, encoding);
      const {
        meta: { fields },
      } = papa.parse(decodedInput, { ...PARSING_OPTIONS, preview: 1 });
      if (fields.some((value: any) => checkedColumns.includes(value))) {
        return encoding;
      }
    }
  }

  _getEncodingColumns() {
    const checkedColumns = this._columns.filter((c: any) => c.checkEncoding).map((c: any) => c.label);
    if (checkedColumns.length === 0) {
      return this._columns.map((c: any) => c.label);
    }
    return checkedColumns;
  }

  _parse(encoding = 'utf8') {
    const decodedInput = iconv.decode(this._input, encoding);
    const {
      data: registrationLines,
      meta: { fields },
      errors,
    } = papa.parse(decodedInput, PARSING_OPTIONS);

    if (errors.length) {
      const hasDelimiterError = errors.some((error: any) => error.type === 'Delimiter');
      if (hasDelimiterError) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        throw new CsvImportError(ERRORS.BAD_CSV_FORMAT);
      }
    }

    return { registrationLines, fields };
  }

  _lineToRegistrationAttributes(line: any) {
    const registrationAttributes = {
      organizationId: this._organizationId,
    };

    this._columns.forEach((column: any) => {
      const value = line[column.label];
      if (column.isDate) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        registrationAttributes[column.name] = this._buildDateAttribute(value);
      } else {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        registrationAttributes[column.name] = value;
      }
    });

    return registrationAttributes;
  }

  _checkColumns(parsedColumns: any) {
    // Required columns
    const missingMandatoryColumn = this._columns
      .filter((c: any) => c.isRequired)
      .find((c: any) => !parsedColumns.includes(c.label));

    if (missingMandatoryColumn) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'HEADER_REQUIRED' does not exist on type ... Remove this comment to see the full error message
      throw new CsvImportError(ERRORS.HEADER_REQUIRED, { field: missingMandatoryColumn.label });
    }

    // Expected columns
    const acceptedColumns = this._columns.map((column: any) => column.label);

    if (_atLeastOneParsedColumnDoesNotMatchAcceptedColumns(parsedColumns, acceptedColumns)) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new CsvImportError(ERRORS.HEADER_UNKNOWN);
    }
  }

  _buildDateAttribute(dateString: any) {
    const convertedDate = convertDateValue({
      dateString,
      inputFormat: 'DD/MM/YYYY',
      alternativeInputFormat: 'DD/MM/YY',
      outputFormat: 'YYYY-MM-DD',
    });
    return convertedDate || dateString;
  }

  _handleError(err: any, index: any) {
    const column = this._columns.find((column: any) => column.name === err.key);
    const line = index + 2;
    const field = column.label;
    if (err.why === 'min_length') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'FIELD_MIN_LENGTH' does not exist on type... Remove this comment to see the full error message
      throw new CsvImportError(ERRORS.FIELD_MIN_LENGTH, { line, field, limit: err.limit });
    }
    if (err.why === 'max_length') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'FIELD_MAX_LENGTH' does not exist on type... Remove this comment to see the full error message
      throw new CsvImportError(ERRORS.FIELD_MAX_LENGTH, { line, field, limit: err.limit });
    }
    if (err.why === 'length') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'FIELD_LENGTH' does not exist on type '{ ... Remove this comment to see the full error message
      throw new CsvImportError(ERRORS.FIELD_LENGTH, { line, field, limit: err.limit });
    }
    if (err.why === 'date_format' || err.why === 'not_a_date') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'FIELD_DATE_FORMAT' does not exist on typ... Remove this comment to see the full error message
      throw new CsvImportError(ERRORS.FIELD_DATE_FORMAT, { line, field });
    }
    if (err.why === 'email_format') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'FIELD_EMAIL_FORMAT' does not exist on ty... Remove this comment to see the full error message
      throw new CsvImportError(ERRORS.FIELD_EMAIL_FORMAT, { line, field });
    }
    if (err.why === 'required') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'FIELD_REQUIRED' does not exist on type '... Remove this comment to see the full error message
      throw new CsvImportError(ERRORS.FIELD_REQUIRED, { line, field });
    }
    if (err.why === 'bad_values') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'FIELD_BAD_VALUES' does not exist on type... Remove this comment to see the full error message
      throw new CsvImportError(ERRORS.FIELD_BAD_VALUES, { line, field, valids: err.valids });
    }
    throw err;
  }
}

function _atLeastOneParsedColumnDoesNotMatchAcceptedColumns(parsedColumns: any, acceptedColumns: any) {
  // @ts-expect-error ts-migrate(7030) FIXME: Not all code paths return a value.
  return parsedColumns.some((parsedColumn: any) => {
    if (parsedColumn !== '') {
      return !acceptedColumns.includes(parsedColumn);
    }
  });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  CsvColumn,
  CsvRegistrationParser,
};
