// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isEmpty'.
const { isEmpty, isNil, each } = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SiecleXmlI... Remove this comment to see the full error message
const { SiecleXmlImportError } = require('../../../domain/errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  INE_REQUIRED: 'INE_REQUIRED',
  INE_UNIQUE: 'INE_UNIQUE',
};
const DIVISION = 'D';

class XMLSchoolingRegistrationsSet {
  schoolingRegistrationsByStudentId: any;
  studentIds: any;
  constructor() {
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
    this.schoolingRegistrationsByStudentId = new Map();
    this.studentIds = [];
  }

  add(id: any, xmlNode: any) {
    const nationalStudentId = _getValueFromParsedElement(xmlNode.ID_NATIONAL);
    this._checkNationalStudentIdUniqueness(nationalStudentId);
    this.studentIds.push(nationalStudentId);

    this.schoolingRegistrationsByStudentId.set(id, _mapStudentInformationToSchoolingRegistration(xmlNode));
  }

  updateDivision(xmlNode: any) {
    const currentStudent = this.schoolingRegistrationsByStudentId.get(xmlNode.STRUCTURES_ELEVE.$.ELEVE_ID);
    const structureElement = xmlNode.STRUCTURES_ELEVE.STRUCTURE;

    each(structureElement, (structure: any) => {
      if (structure.TYPE_STRUCTURE[0] === DIVISION && structure.CODE_STRUCTURE[0] !== 'Inactifs') {
        currentStudent.division = structure.CODE_STRUCTURE[0];
      }
    });
  }

  _checkNationalStudentIdUniqueness(nationalStudentId: any) {
    if (isEmpty(nationalStudentId)) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new SiecleXmlImportError(ERRORS.INE_REQUIRED);
    }
    if (this.studentIds.includes(nationalStudentId)) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'INE_UNIQUE' does not exist on type '{ PA... Remove this comment to see the full error message
      throw new SiecleXmlImportError(ERRORS.INE_UNIQUE, { nationalStudentId });
    }
  }

  has(studentId: any) {
    return this.schoolingRegistrationsByStudentId.has(studentId);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get schoolingRegistrations() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
    return Array.from(this.schoolingRegistrationsByStudentId.values());
  }
}

function _mapStudentInformationToSchoolingRegistration(studentNode: any) {
  return {
    lastName: _getValueFromParsedElement(studentNode.NOM_DE_FAMILLE),
    preferredLastName: _getValueFromParsedElement(studentNode.NOM_USAGE),
    firstName: _getValueFromParsedElement(studentNode.PRENOM),
    middleName: _getValueFromParsedElement(studentNode.PRENOM2),
    thirdName: _getValueFromParsedElement(studentNode.PRENOM3),
    sex: _convertSexCode(studentNode.CODE_SEXE),
    birthdate: moment(studentNode.DATE_NAISS, 'DD/MM/YYYY').format('YYYY-MM-DD') || null,
    birthCountryCode: _getValueFromParsedElement(studentNode.CODE_PAYS),
    birthProvinceCode: _getValueFromParsedElement(studentNode.CODE_DEPARTEMENT_NAISS),
    birthCityCode: _getValueFromParsedElement(studentNode.CODE_COMMUNE_INSEE_NAISS),
    birthCity: _getValueFromParsedElement(studentNode.VILLE_NAISS),
    MEFCode: _getValueFromParsedElement(studentNode.CODE_MEF),
    status: _getValueFromParsedElement(studentNode.CODE_STATUT),
    nationalStudentId: _getValueFromParsedElement(studentNode.ID_NATIONAL),
  };
}

function _convertSexCode(obj: any) {
  const value = _getValueFromParsedElement(obj);
  if (value === '1') return 'M';
  if (value === '2') return 'F';
  return null;
}

function _getValueFromParsedElement(obj: any) {
  if (isNil(obj)) return null;
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
  return Array.isArray(obj) && !isEmpty(obj) ? obj[0] : obj;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = XMLSchoolingRegistrationsSet;
