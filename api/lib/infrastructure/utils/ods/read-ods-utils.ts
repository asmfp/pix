// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const XLSX = require('xlsx');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Unprocessa... Remove this comment to see the full error message
const { UnprocessableEntityError } = require('../../../application/http-errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'loadOdsZip... Remove this comment to see the full error message
const { loadOdsZip } = require('./common-ods-utils');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CONTENT_XM... Remove this comment to see the full error message
const CONTENT_XML_IN_ODS = 'content.xml';

async function getContentXml({
  odsFilePath
}: any) {
  const zip = await loadOdsZip(odsFilePath);
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'file' does not exist on type 'unknown'.
  const contentXmlBufferCompressed = zip.file(CONTENT_XML_IN_ODS);
  const uncompressedBuffer = await contentXmlBufferCompressed.async('nodebuffer');
  return Buffer.from(uncompressedBuffer, 'utf8').toString();
}

async function extractTableDataFromOdsFile({
  odsBuffer,
  tableHeaderTargetPropertyMap
}: any) {
  const sheetDataRows = await getSheetDataRowsFromOdsBuffer({ odsBuffer });
  const tableHeaders = _.map(tableHeaderTargetPropertyMap, 'header');
  const sheetHeaderRow = _findHeaderRow(sheetDataRows, tableHeaders);
  if (!sheetHeaderRow) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
    throw new UnprocessableEntityError('Table headers not found');
  }
  const sheetDataRowsBelowHeader = _extractRowsBelowHeader(sheetHeaderRow, sheetDataRows);
  const sheetHeaderPropertyMap = _mapSheetHeadersWithProperties(sheetHeaderRow, tableHeaderTargetPropertyMap);

  const dataByLine = _transformSheetDataRows(sheetDataRowsBelowHeader, sheetHeaderPropertyMap);
  if (_.isEmpty(dataByLine)) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
    throw new UnprocessableEntityError('No data in table');
  }

  return dataByLine;
}

async function validateOdsHeaders({
  odsBuffer,
  headers
}: any) {
  const sheetDataRows = await getSheetDataRowsFromOdsBuffer({ odsBuffer });
  const headerRow = _findHeaderRow(sheetDataRows, headers);

  if (!headerRow) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
    throw new UnprocessableEntityError('Unknown attendance sheet version');
  }
}

async function getSheetDataRowsFromOdsBuffer({
  odsBuffer,
  jsonOptions = { header: 'A' }
}: any) {
  let document;
  try {
    document = await XLSX.read(odsBuffer, { type: 'buffer', cellDates: true });
  } catch (error) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
    throw new UnprocessableEntityError(error);
  }
  const sheet = document.Sheets[document.SheetNames[0]];
  const sheetDataRows = XLSX.utils.sheet_to_json(sheet, jsonOptions);
  if (_.isEmpty(sheetDataRows)) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
    throw new UnprocessableEntityError('Empty data in sheet');
  }
  return sheetDataRows;
}

function _extractRowsBelowHeader(sheetHeaderRow: any, sheetDataRows: any) {
  const headerIndex = _.findIndex(sheetDataRows, (row: any) => _.isEqual(row, sheetHeaderRow));
  return _takeRightUntilIndex({ array: sheetDataRows, index: headerIndex + 1 });
}

function _takeRightUntilIndex({
  array,
  index
}: any) {
  const countElementsToTake = _.size(array) - index;
  return _.takeRight(array, countElementsToTake);
}

function _findHeaderRow(sheetDataRows: any, tableHeaders: any) {
  return _.find(sheetDataRows, (row: any) => _allHeadersValuesAreInTheRow(row, tableHeaders));
}

function _allHeadersValuesAreInTheRow(row: any, headers: any) {
  const cellValuesInRow = _.values(row);
  const strippedCellValuesInRow = _.map(cellValuesInRow, _removeNewlineCharacters);
  const strippedHeaders = _.map(headers, _removeNewlineCharacters);
  const headersInRow = _.intersection(strippedCellValuesInRow, strippedHeaders);
  return headersInRow.length === headers.length;
}

function _removeNewlineCharacters(header: any) {
  return _.isString(header) ? header.replace(/[\n\r]/g, '') : header;
}

function _mapSheetHeadersWithProperties(sheetHeaderRow: any, tableHeaderTargetPropertyMap: any) {
  return _(sheetHeaderRow).map(_addTargetDatas(tableHeaderTargetPropertyMap)).compact().value();
}

function _findTargetPropertiesByHeader(tableHeaderTargetPropertyMap: any, header: any) {
  const mapWithSanitizedHeaders = _.map(tableHeaderTargetPropertyMap, (obj: any) => ({
    ...obj,
    header: _removeNewlineCharacters(obj.header)
  }));

  return _.find(mapWithSanitizedHeaders, { header: _removeNewlineCharacters(header) });
}

function _addTargetDatas(tableHeaderTargetPropertyMap: any) {
  // @ts-expect-error ts-migrate(7030) FIXME: Not all code paths return a value.
  return (header: any, columnName: any) => {
    const targetProperties = _findTargetPropertiesByHeader(tableHeaderTargetPropertyMap, header);
    if (targetProperties) {
      const { property: targetProperty, transformFn } = targetProperties;
      return { columnName, targetProperty, transformFn };
    }
  };
}

function _transformSheetDataRows(sheetDataRows: any, sheetHeaderPropertyMap: any) {
  const dataByLine = {};
  for (const sheetDataRow of sheetDataRows) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    dataByLine[sheetDataRow['__rowNum__']] = _transformSheetDataRow(sheetDataRow, sheetHeaderPropertyMap);
  }
  return dataByLine;
}

function _transformSheetDataRow(sheetDataRow: any, sheetHeaderPropertyMap: any) {
  return _.reduce(
    sheetHeaderPropertyMap,
    (target: any, {
      columnName,
      targetProperty,
      transformFn
    }: any) => {
      const cellValue = sheetDataRow[columnName];
      target[targetProperty] = transformFn(cellValue);
      return target;
    },
    {}
  );
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  extractTableDataFromOdsFile,
  getContentXml,
  getSheetDataRowsFromOdsBuffer,
  validateOdsHeaders,
};
