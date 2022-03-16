// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'loadOdsZip... Remove this comment to see the full error message
const { loadOdsZip } = require('./common-ods-utils');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { DOMParser, XMLSerializer } = require('xmldom');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const AddedCellOption = require('./added-cell-option');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CONTENT_XM... Remove this comment to see the full error message
const CONTENT_XML_IN_ODS = 'content.xml';

class OdsUtilsBuilder {
  xmlDom: any;
  constructor(stringifiedXml: any) {
    this.xmlDom = _buildXmlDomFromXmlString(stringifiedXml);
  }

  withData(dataToInject: any, templateValues: any) {
    const intermediateXmlDom = _.cloneDeep(this.xmlDom);
    for (const { placeholder, propertyName } of templateValues) {
      const targetXmlDomElement = _getXmlDomElementByText(intermediateXmlDom, placeholder);
      if (targetXmlDomElement) {
        const newXmlValue = dataToInject[propertyName];
        targetXmlDomElement.textContent = newXmlValue;
      }
    }

    this.xmlDom = intermediateXmlDom;

    return this;
  }

  withTooltipOnCell({
    xmlDom,
    tooltipName,
    tooltipTitle,
    tooltipContentLines
  }: any) {
    return this.withValidatorRestrictedList({
      xmlDom,
      validatorName: tooltipName,
      allowEmptyCell: true,
      tooltipTitle,
      tooltipContentLines,
    });
  }

  withValidatorRestrictedList({
    validatorName,
    restrictedList,
    allowEmptyCell = true,
    tooltipTitle,
    tooltipContentLines
  }: any) {
    const contentValidations = this.xmlDom.getElementsByTagName('table:content-validations').item(0);
    const validator = this.xmlDom.createElement('table:content-validation');
    validator.setAttribute('table:name', validatorName);
    if (restrictedList?.length) {
      validator.setAttribute(
        'table:condition',
        `of:cell-content-is-in-list(${restrictedList.map((val: any) => `"${val}"`).join(';')})`
      );
      validator.setAttribute('table:allow-empty-cell', allowEmptyCell);
    }

    const helpMessage = this.xmlDom.createElement('table:help-message');
    helpMessage.setAttribute('table:title', tooltipTitle);
    helpMessage.setAttribute('table:display', 'true');

    const helpMessageWithContent = tooltipContentLines.reduce((helpMessageAccumulator: any, line: any) => {
      const paragraph = this.xmlDom.createElement('text:p');
      paragraph.textContent = line;
      helpMessageAccumulator.appendChild(paragraph);
      return helpMessageAccumulator;
    }, helpMessage);

    validator.appendChild(helpMessageWithContent);

    const errorMessage = this.xmlDom.createElement('table:error-message');
    errorMessage.setAttribute('table:display', 'true');
    errorMessage.setAttribute('table:message-type', 'stop');

    validator.appendChild(errorMessage);
    contentValidations.appendChild(validator);

    return this;
  }

  withColumnGroup({
    groupHeaderLabel,
    columns,
    startsAt,
    headerRowSpan,
    tableHeaderRow,
    tableFirstRow
  }: any) {
    this.withColumnGroupHeader({
      headerLabel: groupHeaderLabel,
      numberOfColumns: columns.length,
      lineNumber: startsAt,
      rowspan: headerRowSpan,
    });

    columns.forEach((col: any) => this._addColumn(col, tableHeaderRow, tableFirstRow));

    this.incrementRowsColumnSpan({
      startLine: 0,
      endLine: startsAt - 1,
      increment: columns.length,
    });
  }

  incrementRowsColumnSpan({
    startLine,
    endLine,
    increment
  }: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
    const rows = Array.from(this.xmlDom.getElementsByTagName('table:table-row'));

    for (let i = startLine; i <= endLine; i++) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
      const element = Array.from(rows[i].getElementsByTagName('table:table-cell'))
        .reverse()
        .find((element: any) => element.hasAttribute('table:number-columns-spanned'));
      if (element) {
        element.setAttribute(
          'table:number-columns-spanned',
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
          parseInt(element.getAttribute('table:number-columns-spanned')) + increment
        );
      }
    }

    return this;
  }

  withColumnGroupHeader({
    headerLabel,
    numberOfColumns,
    lineNumber,
    rowspan
  }: any) {
    const headerLabelWords = headerLabel.split(' ');

    let addedCellOption = new AddedCellOption({
      labels: [headerLabel],
      rowspan,
      colspan: numberOfColumns,
      positionOffset: 2,
    });

    if (numberOfColumns === 1) {
      addedCellOption = new AddedCellOption({
        labels: headerLabelWords,
        rowspan,
        colspan: numberOfColumns,
        positionOffset: 2,
      });
    }

    this._withCellToEndOfLineWithStyleOfCellLabelled({
      lineNumber,
      cellToCopyLabel: '* Lieu de naissance',
      addedCellOption,
    });

    return this;
  }

  _withCellToEndOfLineWithStyleOfCellLabelled({
    lineNumber,
    cellToCopyLabel,
    addedCellOption
  }: any) {
    const cellToCopy = _getXmlDomElementByText(this.xmlDom, cellToCopyLabel).parentNode;
    const clonedCell = _deepCloneDomElement(cellToCopy);

    _updateCellTextContent({ clonedCell, textContent: addedCellOption.labels });

    if (addedCellOption.rowspan) {
      clonedCell.setAttribute('table:number-rows-spanned', addedCellOption.rowspan);
    }
    if (addedCellOption.colspan) {
      clonedCell.setAttribute('table:number-columns-spanned', addedCellOption.colspan);
    }

    const addedCellPositionOffset = addedCellOption.positionOffset ? addedCellOption.positionOffset : 1;
    this.addCellToEndOfLine({
      lineNumber,
      cell: clonedCell,
      positionOffset: addedCellPositionOffset,
    });

    if (addedCellOption.colspan && addedCellOption.colspan > 0) {
      const coveredTableCell = this.xmlDom.createElement('table:covered-table-cell');
      coveredTableCell.setAttribute('table:number-columns-repeated', addedCellOption.colspan - 1);
      const coveredTableCellPositionOffset = addedCellOption.positionOffset ? addedCellOption.positionOffset : 1;
      this.addCellToEndOfLine({
        lineNumber,
        cell: coveredTableCell,
        positionOffset: coveredTableCellPositionOffset,
      });
    }
  }

  addCellToEndOfLine({
    lineNumber,
    cell,
    positionOffset
  }: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
    const line = Array.from(this.xmlDom.getElementsByTagName('table:table-row'))[lineNumber];
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
    const lineChildNodes = Array.from(line.childNodes);
    line.insertBefore(cell, lineChildNodes[lineChildNodes.length - positionOffset]);
    return this;
  }

  _addColumn(column: any, tableHeaderRow: any, tableFirstRow: any) {
    this._withCellToEndOfLineWithStyleOfCellLabelled({
      lineNumber: tableHeaderRow,
      cellToCopyLabel: 'Temps majoré ?',
      addedCellOption: new AddedCellOption({ labels: column.headerLabel }),
    });

    this._withCellToEndOfLineWithStyleOfCellLabelled({
      lineNumber: tableFirstRow,
      cellToCopyLabel: 'EXTERNAL_ID',
      addedCellOption: new AddedCellOption({ labels: column.placeholder }),
    });
  }

  updateXmlRows({
    rowMarkerPlaceholder,
    rowTemplateValues,
    dataToInject
  }: any) {
    const { referenceRowElement, rowsContainerElement } = _getRefRowAndContainerDomElements(
      this.xmlDom,
      rowMarkerPlaceholder
    );

    const cloneRowElement = _deepCloneDomElement(referenceRowElement);
    rowsContainerElement.removeChild(referenceRowElement);

    _.each(dataToInject, (rowDataToInject: any) => {
      const currentCloneRowElement = _deepCloneDomElement(cloneRowElement);
      _updateXmlElementWithData(currentCloneRowElement, rowDataToInject, rowTemplateValues);
      rowsContainerElement.appendChild(currentCloneRowElement);
    });

    return this;
  }

  async build({
    templateFilePath
  }: any) {
    const stringifiedXML = new XMLSerializer().serializeToString(this.xmlDom);
    return this.generateODSBuffer({ stringifiedXML, templateFilePath });
  }

  async generateODSBuffer({
    stringifiedXML,
    templateFilePath
  }: any) {
    const inMemoryZippedTemplate = await loadOdsZip(templateFilePath);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'file' does not exist on type 'unknown'.
    await inMemoryZippedTemplate.file(CONTENT_XML_IN_ODS, stringifiedXML);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'generateAsync' does not exist on type 'u... Remove this comment to see the full error message
    const odsBuffer = await inMemoryZippedTemplate.generateAsync({ type: 'nodebuffer' });
    return odsBuffer;
  }
}

async function makeUpdatedOdsByContentXml({
  stringifiedXml,
  odsFilePath
}: any) {
  const zip = await loadOdsZip(odsFilePath);
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'file' does not exist on type 'unknown'.
  await zip.file(CONTENT_XML_IN_ODS, stringifiedXml);
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'generateAsync' does not exist on type 'u... Remove this comment to see the full error message
  const odsBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  return odsBuffer;
}

function updateXmlRows({
  stringifiedXml,
  rowMarkerPlaceholder,
  rowTemplateValues,
  dataToInject
}: any) {
  const parsedXmlDom = _buildXmlDomFromXmlString(stringifiedXml);

  const { referenceRowElement, rowsContainerElement } = _getRefRowAndContainerDomElements(
    parsedXmlDom,
    rowMarkerPlaceholder
  );

  const cloneRowElement = _deepCloneDomElement(referenceRowElement);
  rowsContainerElement.removeChild(referenceRowElement);

  _.each(dataToInject, (rowDataToInject: any) => {
    const currentCloneRowElement = _deepCloneDomElement(cloneRowElement);
    _updateXmlElementWithData(currentCloneRowElement, rowDataToInject, rowTemplateValues);
    rowsContainerElement.appendChild(currentCloneRowElement);
  });

  return _buildStringifiedXmlFromXmlDom(parsedXmlDom);
}

function incrementRowsColumnSpan({
  stringifiedXml,
  startLine,
  endLine,
  increment
}: any) {
  const parsedXmlDom = _buildXmlDomFromXmlString(stringifiedXml);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
  const rows = Array.from(parsedXmlDom.getElementsByTagName('table:table-row'));

  for (let i = startLine; i <= endLine; i++) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
    const element = Array.from(rows[i].getElementsByTagName('table:table-cell'))
      .reverse()
      .find((element: any) => element.hasAttribute('table:number-columns-spanned'));
    if (element) {
      element.setAttribute(
        'table:number-columns-spanned',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
        parseInt(element.getAttribute('table:number-columns-spanned')) + increment
      );
    }
  }

  return _buildStringifiedXmlFromXmlDom(parsedXmlDom);
}

function addCellToEndOfLineWithStyleOfCellLabelled({
  stringifiedXml,
  lineNumber,
  cellToCopyLabel,
  addedCellOption
}: any) {
  const parsedXmlDom = _buildXmlDomFromXmlString(stringifiedXml);
  const cellToCopy = _getXmlDomElementByText(parsedXmlDom, cellToCopyLabel).parentNode;
  const clonedCell = _deepCloneDomElement(cellToCopy);

  _updateCellTextContent({ clonedCell, textContent: addedCellOption.labels });

  if (addedCellOption.rowspan) {
    clonedCell.setAttribute('table:number-rows-spanned', addedCellOption.rowspan);
  }
  if (addedCellOption.colspan) {
    clonedCell.setAttribute('table:number-columns-spanned', addedCellOption.colspan);
  }

  const addedCellPositionOffset = addedCellOption.positionOffset ? addedCellOption.positionOffset : 1;
  _addCellToEndOfLine({
    parsedXmlDom,
    lineNumber,
    cell: clonedCell,
    positionOffset: addedCellPositionOffset,
  });

  if (addedCellOption.colspan && addedCellOption.colspan > 0) {
    const coveredTableCell = parsedXmlDom.createElement('table:covered-table-cell');
    coveredTableCell.setAttribute('table:number-columns-repeated', addedCellOption.colspan - 1);
    const coveredTableCellPositionOffset = addedCellOption.positionOffset ? addedCellOption.positionOffset : 1;
    _addCellToEndOfLine({
      parsedXmlDom,
      lineNumber,
      cell: coveredTableCell,
      positionOffset: coveredTableCellPositionOffset,
    });
  }

  return _buildStringifiedXmlFromXmlDom(parsedXmlDom);
}

function _updateCellTextContent({
  clonedCell,
  textContent
}: any) {
  const textNode = clonedCell.getElementsByTagName('text:p').item(0);
  _updateStringXmlElement(textNode.childNodes.item(0), textContent[0]);
  for (let i = 1; i < textContent.length; i++) {
    const clonedTextNode = _deepCloneDomElement(textNode);
    _updateStringXmlElement(clonedTextNode.childNodes.item(0), textContent[i]);
    clonedCell.appendChild(clonedTextNode);
  }
}

function _addCellToEndOfLine({
  parsedXmlDom,
  lineNumber,
  cell,
  positionOffset
}: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
  const line = Array.from(parsedXmlDom.getElementsByTagName('table:table-row'))[lineNumber];
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
  const lineChildNodes = Array.from(line.childNodes);
  line.insertBefore(cell, lineChildNodes[lineChildNodes.length - positionOffset]);
}

function addValidatorRestrictedList({
  stringifiedXml,
  validatorName,
  restrictedList,
  allowEmptyCell = true,
  tooltipTitle,
  tooltipContentLines
}: any) {
  const parsedXmlDom = _buildXmlDomFromXmlString(stringifiedXml);
  const contentValidations = parsedXmlDom.getElementsByTagName('table:content-validations').item(0);
  const validator = parsedXmlDom.createElement('table:content-validation');
  validator.setAttribute('table:name', validatorName);
  if (restrictedList?.length) {
    validator.setAttribute(
      'table:condition',
      `of:cell-content-is-in-list(${restrictedList.map((val: any) => `"${val}"`).join(';')})`
    );
    validator.setAttribute('table:allow-empty-cell', allowEmptyCell);
  }

  const helpMessage = parsedXmlDom.createElement('table:help-message');
  helpMessage.setAttribute('table:title', tooltipTitle);
  helpMessage.setAttribute('table:display', 'true');

  const helpMessageWithContent = tooltipContentLines.reduce((helpMessageAccumulator: any, line: any) => {
    const paragraph = parsedXmlDom.createElement('text:p');
    paragraph.textContent = line;
    helpMessageAccumulator.appendChild(paragraph);
    return helpMessageAccumulator;
  }, helpMessage);

  validator.appendChild(helpMessageWithContent);

  const errorMessage = parsedXmlDom.createElement('table:error-message');
  errorMessage.setAttribute('table:display', 'true');
  errorMessage.setAttribute('table:message-type', 'stop');

  validator.appendChild(errorMessage);
  contentValidations.appendChild(validator);

  return _buildStringifiedXmlFromXmlDom(parsedXmlDom);
}

function addTooltipOnCell({
  stringifiedXml,
  tooltipName,
  tooltipTitle,
  tooltipContentLines
}: any) {
  return addValidatorRestrictedList({
    stringifiedXml,
    validatorName: tooltipName,
    allowEmptyCell: true,
    tooltipTitle,
    tooltipContentLines,
  });
}

function _getRefRowAndContainerDomElements(parsedXmlDom: any, rowMarkerPlaceholder: any) {
  const referenceRowElement = _getXmlDomElementByText(parsedXmlDom, rowMarkerPlaceholder).parentNode.parentNode;
  return {
    referenceRowElement,
    rowsContainerElement: referenceRowElement.parentNode,
  };
}

function _deepCloneDomElement(domElement: any) {
  const isDeep = true;
  return domElement.cloneNode(isDeep);
}

function _buildXmlDomFromXmlString(stringifiedXml: any) {
  return new DOMParser().parseFromString(stringifiedXml);
}

function _updateXmlElementWithData(xmlElement: any, dataToInject: any, templateValues: any) {
  for (const { placeholder, propertyName, validator } of templateValues) {
    const targetXmlDomElement = _getXmlDomElementByText(xmlElement, placeholder);
    if (targetXmlDomElement) {
      _updateXmlElementByType(
        targetXmlDomElement.parentNode,
        targetXmlDomElement,
        dataToInject[propertyName],
        validator
      );
    }
  }
}

function _updateXmlElementByType(xmlElement: any, xmlElementTextChild: any, data: any, validator: any) {
  if (validator) {
    xmlElement.setAttribute('table:content-validation-name', validator);
  }

  if (data === '') {
    _clearXmlElement(xmlElement, xmlElementTextChild);
    return;
  }
  const valueType = xmlElement.getAttribute('office:value-type');
  switch (valueType) {
    case 'date':
      _updateDateXmlElement(xmlElement, xmlElementTextChild, data);
      break;
    case 'percentage':
      _updatePercentageXmlElement(xmlElement, xmlElementTextChild, data);
      break;
    case 'string':
    default:
      _updateStringXmlElement(xmlElementTextChild, data);
      break;
  }
}

function _clearXmlElement(xmlElement: any, xmlElementTextChild: any) {
  xmlElement.removeChild(xmlElementTextChild);
  xmlElement.removeAttribute('office:value-type');
  xmlElement.removeAttribute('office:date-value');
  xmlElement.removeAttribute('calcext:value-type');
  xmlElement.removeAttribute('office:value');
}

function _updateStringXmlElement(xmlElementTextChild: any, data: any) {
  xmlElementTextChild.textContent = data;
}

function _updateDateXmlElement(xmlElement: any, xmlElementTextChild: any, data: any) {
  xmlElement.setAttribute('office:date-value', data);
  xmlElement.removeChild(xmlElementTextChild);
}

function _updatePercentageXmlElement(xmlElement: any, xmlElementTextChild: any, data: any) {
  xmlElement.setAttribute('office:value', data);
  xmlElement.removeChild(xmlElementTextChild);
}

function _getXmlDomElementByText(parsedXmlDom: any, text: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
  for (const xmlDomElement of Array.from(parsedXmlDom.getElementsByTagName('text:p'))) {
    if (xmlDomElement.textContent === text) {
      return xmlDomElement;
    }
  }
}

function _buildStringifiedXmlFromXmlDom(parsedXmlDom: any) {
  return new XMLSerializer().serializeToString(parsedXmlDom);
}

function updateXmlSparseValues({
  stringifiedXml,
  templateValues,
  dataToInject
}: any) {
  const parsedXmlDom = _buildXmlDomFromXmlString(stringifiedXml);
  const parsedXmlDomUpdated = _updateXmlDomWithData(parsedXmlDom, dataToInject, templateValues);
  return _buildStringifiedXmlFromXmlDom(parsedXmlDomUpdated);
}

function _updateXmlDomWithData(parsedXmlDom: any, dataToInject: any, templateValues: any) {
  const parsedXmlDomUpdated = _.cloneDeep(parsedXmlDom);
  for (const { placeholder, propertyName } of templateValues) {
    const targetXmlDomElement = _getXmlDomElementByText(parsedXmlDomUpdated, placeholder);
    if (targetXmlDomElement) {
      const newXmlValue = dataToInject[propertyName];
      targetXmlDomElement.textContent = newXmlValue;
    }
  }
  return parsedXmlDomUpdated;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  makeUpdatedOdsByContentXml,
  updateXmlSparseValues,
  updateXmlRows,
  addCellToEndOfLineWithStyleOfCellLabelled,
  incrementRowsColumnSpan,
  addValidatorRestrictedList,
  addTooltipOnCell,
  OdsUtilsBuilder,
};
