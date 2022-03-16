// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
const SchoolingRegistration = require('../../../domain/models/SchoolingRegistration');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkValid... Remove this comment to see the full error message
const { checkValidation } = require('../../../domain/validators/schooling-registration-validator');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { checkValidationUnicity } = require('../../../domain/validators/schooling-registration-set-validator');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CsvRegistr... Remove this comment to see the full error message
const { CsvRegistrationParser } = require('./csv-registration-parser');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CsvImportE... Remove this comment to see the full error message
const { CsvImportError } = require('../../../../lib/domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
const SchoolingRegistrationColumns = require('./schooling-registration-columns');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  IDENTIFIER_UNIQUE: 'IDENTIFIER_UNIQUE',
  INSEE_CODE_INVALID: 'INSEE_CODE_INVALID',
};

const sexPossibleValues = {
  M: 'M',
  F: 'F',
};

class SchoolingRegistrationSet {
  registrations: any;
  constructor() {
    this.registrations = [];
  }

  addRegistration(registrationAttributes: any) {
    checkValidation(registrationAttributes);
    const transformedAttributes = this._transform(registrationAttributes);
    const registration = new SchoolingRegistration(transformedAttributes);
    this.registrations.push(registration);
    checkValidationUnicity(this);
  }

  _transform(registrationAttributes: any) {
    let sex;
    const { birthCountryCode, nationalIdentifier } = registrationAttributes;

    if (registrationAttributes.sex) {
      sex = _convertSexCodeToLabel(registrationAttributes.sex);
    } else {
      sex = null;
    }

    return {
      ...registrationAttributes,
      birthCountryCode: birthCountryCode.slice(-3),
      nationalStudentId: nationalIdentifier,
      sex,
    };
  }
}

function _convertSexCodeToLabel(sexCode: any) {
  if (sexCode) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return sexPossibleValues[sexCode.toUpperCase().charAt(0)];
  }
  return null;
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
class SchoolingRegistrationParser extends CsvRegistrationParser {
  constructor(input: any, organizationId: any, i18n: any) {
    const registrationSet = new SchoolingRegistrationSet();

    const columns = new SchoolingRegistrationColumns(i18n).columns;

    super(input, organizationId, columns, registrationSet);
  }

  _handleError(err: any, index: any) {
    const column = this._columns.find((column: any) => column.name === err.key);
    const line = index + 2;
    const field = column.label;

    if (err.why === 'uniqueness' && err.key === 'nationalIdentifier') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'IDENTIFIER_UNIQUE' does not exist on typ... Remove this comment to see the full error message
      throw new CsvImportError(ERRORS.IDENTIFIER_UNIQUE, { line, field });
    }

    if (err.why === 'not_valid_insee_code') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'INSEE_CODE_INVALID' does not exist on ty... Remove this comment to see the full error message
      throw new CsvImportError(ERRORS.INSEE_CODE_INVALID, { line, field });
    }

    // @ts-expect-error ts-migrate(2556) FIXME: Expected 2 arguments, but got 0 or more.
    super._handleError(...arguments);
  }

  static buildParser() {
    // @ts-expect-error ts-migrate(2472) FIXME: Spread operator in 'new' expressions is only avail... Remove this comment to see the full error message
    return new SchoolingRegistrationParser(...arguments);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SchoolingRegistrationParser;
