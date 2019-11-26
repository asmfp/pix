const _ = require('lodash');
const { convertDateValue } = require('../../utils/date-utils');

const CURRENT_ATTENDANCE_SHEET_VERSION = '1.1';
// These are transformation structures. They provide all the necessary info
// on how to transform cell values in an attendance sheet into a target JS object.
// Such a structure is an array holding objects with 3 properties. One object
// represents the transformation formula for one specific column in the ods file.
// Those 3 properties are:
//  - header -> Header in the ods file under which the cell values will be found
//  - property -> Property name of the target object in which the value will be put
//  - transformFn -> Transformation function through which the cell value will be processed into the final value

// V1
const _TRANSFORMATION_STRUCT_COMMON_V1_0 = [
  {
    header: 'NOM',
    property: 'lastName',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Prénom',
    property: 'firstName',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Identifiant local',
    property: 'externalId',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Temps majoré ?',
    property: 'extraTimePercentage',
    transformFn: _toNonZeroValueOrNull,
  },
  {
    header: 'Date de naissance (format : jj/mm/aaaa)',
    property: 'birthdate',
    transformFn: (cellVal) => {
      return convertDateValue(cellVal, 'DD/MM/YYYY', 'YYYY-MM-DD');
    },
  },
];

const _TRANSFORMATION_STRUCT_FOR_PIX_CERTIF_CANDIDATES_IMPORT_V1_0 = [
  ..._TRANSFORMATION_STRUCT_COMMON_V1_0,
  {
    header: 'Lieu de naissance',
    property: 'birthCity',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
];

const _TRANSFORMATION_STRUCT_FOR_PIX_ADMIN_CERTIFICATIONS_PARSING_V1_0 = [
  ..._TRANSFORMATION_STRUCT_COMMON_V1_0,
  {
    header: 'Lieu de naissance',
    property: 'birthplace',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Adresse électronique de convocation',
    property: 'email',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Signature',
    property: 'signature',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Numéro de certification\n(sans le #)',
    property: 'certificationId',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Ecran de fin de test vu\n(cocher)',
    property: 'lastScreen',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Commentaires / Signalements\n(test non achevé, incident technique, fraude, etc.)\nà compléter par un rapport si nécessaire',
    property: 'comments',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
];

// V2
const _TRANSFORMATION_STRUCT_COMMON_V1_1 = [
  {
    header: 'NOM',
    property: 'lastName',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Prénom',
    property: 'firstName',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Identifiant local',
    property: 'externalId',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Temps majoré ?',
    property: 'extraTimePercentage',
    transformFn: _toNonZeroValueOrNull,
  },
  {
    header: 'Date de naissance (format : jj/mm/aaaa)',
    property: 'birthdate',
    transformFn: (cellVal) => {
      return convertDateValue(cellVal, 'DD/MM/YYYY', 'YYYY-MM-DD');
    },
  },
];

const _TRANSFORMATION_STRUCT_FOR_PIX_CERTIF_CANDIDATES_IMPORT_V1_1 = [
  ..._TRANSFORMATION_STRUCT_COMMON_V1_1,
  {
    header: 'Commune de naissance',
    property: 'birthCity',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Code du département de naissance',
    property: 'birthProvinceCode',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Pays de naissance',
    property: 'birthCountry',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
];

const _TRANSFORMATION_STRUCT_FOR_PIX_ADMIN_CERTIFICATIONS_PARSING_V1_1 = [
  ..._TRANSFORMATION_STRUCT_COMMON_V1_1,
  {
    header: 'Commune de naissance',
    property: 'birthplace',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Signature',
    property: 'signature',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Numéro de certification\n(sans le #)',
    property: 'certificationId',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Ecran de fin de test vu\n(cocher)',
    property: 'lastScreen',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Commentaires / Signalements\n(test non achevé, incident technique, fraude, etc.)\nà compléter par un rapport si nécessaire',
    property: 'comments',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
];

// ALL
const TRANSFORMATION_STRUCTS_FOR_PIX_CERTIF_CANDIDATES_IMPORT_BY_VERSION = {
  '1.0': {
    version: '1.0',
    transformStruct : _TRANSFORMATION_STRUCT_FOR_PIX_CERTIF_CANDIDATES_IMPORT_V1_0,
    headers: _getHeadersFromTransformationStruct(_TRANSFORMATION_STRUCT_FOR_PIX_CERTIF_CANDIDATES_IMPORT_V1_0),
  },
  '1.1': {
    version: '1.1',
    transformStruct : _TRANSFORMATION_STRUCT_FOR_PIX_CERTIF_CANDIDATES_IMPORT_V1_1,
    headers: _getHeadersFromTransformationStruct(_TRANSFORMATION_STRUCT_FOR_PIX_CERTIF_CANDIDATES_IMPORT_V1_1),
  }
};

const TRANSFORMATION_STRUCTS_FOR_PIX_ADMIN_CERTIFICATIONS_PARSING_BY_VERSION = {
  '1.0': {
    version: '1.0',
    transformStruct : _TRANSFORMATION_STRUCT_FOR_PIX_ADMIN_CERTIFICATIONS_PARSING_V1_0,
    headers: _getHeadersFromTransformationStruct(_TRANSFORMATION_STRUCT_FOR_PIX_ADMIN_CERTIFICATIONS_PARSING_V1_0),
  },
  '1.1': {
    version: '1.1',
    transformStruct : _TRANSFORMATION_STRUCT_FOR_PIX_ADMIN_CERTIFICATIONS_PARSING_V1_1,
    headers: _getHeadersFromTransformationStruct(_TRANSFORMATION_STRUCT_FOR_PIX_ADMIN_CERTIFICATIONS_PARSING_V1_1),
  }
};

function _toNotEmptyTrimmedStringOrNull(val) {
  const value = _.toString(val);
  const trimmedValue = _.trim(value);
  return _.isEmpty(trimmedValue) ? null : trimmedValue;
}

function _toNonZeroValueOrNull(val) {
  const value = _.toNumber(val);
  return _.isNaN(value) ? null : (value === 0 ? null : value);
}

function _getHeadersFromTransformationStruct(transformationStruct) {
  return _.map(transformationStruct, 'header');
}

module.exports = {
  CURRENT_ATTENDANCE_SHEET_VERSION,
  TRANSFORMATION_STRUCTS_FOR_PIX_CERTIF_CANDIDATES_IMPORT_BY_VERSION,
  TRANSFORMATION_STRUCTS_FOR_PIX_ADMIN_CERTIFICATIONS_PARSING_BY_VERSION,
};
