// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../infrastructure/logger');

function _csvFormulaEscapingPrefix(data: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'test' does not exist on type '{}'.
  const mayBeInterpretedAsFormula = /^[-@=+]/.test(data);
  return mayBeInterpretedAsFormula ? "'" : '';
}

function _csvSerializeValue(data: any) {
  if (typeof data === 'number') {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'toString' does not exist on type 'number... Remove this comment to see the full error message
    return data.toString().replace(/\./, ',');
  } else if (typeof data === 'string') {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'test' does not exist on type '{}'.
    if (/^[0-9-]+$/.test(data)) {
      return data;
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'replace' does not exist on type 'string'... Remove this comment to see the full error message
      return `"${_csvFormulaEscapingPrefix(data)}${data.replace(/"/g, '""')}"`;
    }
  } else {
    logger.error(`Unknown value type in _csvSerializeValue: ${typeof data}: ${data}`);
    return '""';
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serializeLine(lineArray: any) {
    return lineArray.map(_csvSerializeValue).join(';') + '\n';
  },
};
