// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'FRANCE_COU... Remove this comment to see the full error message
const FRANCE_COUNTRY_CODE = '99100';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../../../domain/models/CertificationCandidate');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class CandidateData {
  billingMode: any;
  birthCity: any;
  birthCountry: any;
  birthINSEECode: any;
  birthPostalCode: any;
  birthProvinceCode: any;
  birthdate: any;
  cleaNumerique: any;
  count: any;
  createdAt: any;
  email: any;
  externalId: any;
  extraTimePercentage: any;
  firstName: any;
  id: any;
  lastName: any;
  pixPlusDroit: any;
  prepaymentCode: any;
  resultRecipientEmail: any;
  schoolingRegistrationId: any;
  sessionId: any;
  sex: any;
  userId: any;
  constructor({
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'id' implicitly has an 'any' type.
    id = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'firstName' implicitly has an 'any... Remove this comment to see the full error message
    firstName = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'lastName' implicitly has an 'any'... Remove this comment to see the full error message
    lastName = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'sex' implicitly has an 'any' type... Remove this comment to see the full error message
    sex = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'birthPostalCode' implicitly has a... Remove this comment to see the full error message
    birthPostalCode = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'birthINSEECode' implicitly has an... Remove this comment to see the full error message
    birthINSEECode = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'birthCity' implicitly has an 'any... Remove this comment to see the full error message
    birthCity = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'birthProvinceCode' implicitly has... Remove this comment to see the full error message
    birthProvinceCode = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'birthCountry' implicitly has an '... Remove this comment to see the full error message
    birthCountry = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'email' implicitly has an 'any' ty... Remove this comment to see the full error message
    email = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'resultRecipientEmail' implicitly ... Remove this comment to see the full error message
    resultRecipientEmail = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'externalId' implicitly has an 'an... Remove this comment to see the full error message
    externalId = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'birthdate' implicitly has an 'any... Remove this comment to see the full error message
    birthdate = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'extraTimePercentage' implicitly h... Remove this comment to see the full error message
    extraTimePercentage = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'createdAt' implicitly has an 'any... Remove this comment to see the full error message
    createdAt = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'sessionId' implicitly has an 'any... Remove this comment to see the full error message
    sessionId = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'userId' implicitly has an 'any' t... Remove this comment to see the full error message
    userId = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'schoolingRegistrationId' implicit... Remove this comment to see the full error message
    schoolingRegistrationId = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'number' implicitly has an 'any' t... Remove this comment to see the full error message
    number = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'complementaryCertifications' impl... Remove this comment to see the full error message
    complementaryCertifications = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'billingMode' implicitly has an 'a... Remove this comment to see the full error message
    billingMode = null,
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'prepaymentCode' implicitly has an... Remove this comment to see the full error message
    prepaymentCode = null,
  }) {
    this.id = this._emptyStringIfNull(id);
    this.firstName = this._emptyStringIfNull(firstName);
    this.lastName = this._emptyStringIfNull(lastName);
    this.sex = this._emptyStringIfNull(sex);
    this.birthPostalCode = this._emptyStringIfNull(birthPostalCode);
    this.birthINSEECode = this._emptyStringIfNull(birthINSEECode);
    this.birthCity = this._emptyStringIfNull(birthCity);
    this.birthProvinceCode = this._emptyStringIfNull(birthProvinceCode);
    this.birthCountry = this._emptyStringIfNull(birthCountry);
    this.email = this._emptyStringIfNull(email);
    this.resultRecipientEmail = this._emptyStringIfNull(resultRecipientEmail);
    this.externalId = this._emptyStringIfNull(externalId);
    this.birthdate = birthdate === null ? '' : moment(birthdate, 'YYYY-MM-DD').format('YYYY-MM-DD');
    if (!_.isFinite(extraTimePercentage) || extraTimePercentage <= 0) {
      this.extraTimePercentage = '';
    } else {
      this.extraTimePercentage = extraTimePercentage;
    }
    this.createdAt = this._emptyStringIfNull(createdAt);
    this.sessionId = this._emptyStringIfNull(sessionId);
    this.userId = this._emptyStringIfNull(userId);
    this.schoolingRegistrationId = this._emptyStringIfNull(schoolingRegistrationId);
    this.billingMode = CertificationCandidate.translateBillingMode(billingMode);
    this.prepaymentCode = this._emptyStringIfNull(prepaymentCode);
    this.cleaNumerique = this._displayYesIfCandidateHasComplementaryCertification(
      complementaryCertifications,
      'CléA Numérique'
    );
    this.pixPlusDroit = this._displayYesIfCandidateHasComplementaryCertification(
      complementaryCertifications,
      'Pix+ Droit'
    );
    this.count = number;
    this._clearBirthInformationDataForExport();
  }

  _emptyStringIfNull(value: any) {
    return value === null ? '' : value;
  }

  _clearBirthInformationDataForExport() {
    if (this.birthCountry.toUpperCase() === 'FRANCE') {
      if (this.birthINSEECode) {
        this.birthPostalCode = '';
        this.birthCity = '';
      }

      return;
    }

    if (this.birthINSEECode && this.birthINSEECode !== FRANCE_COUNTRY_CODE) {
      this.birthINSEECode = '99';
    }
  }

  _displayYesIfCandidateHasComplementaryCertification(complementaryCertifications: any, certificationLabel: any) {
    if (!complementaryCertifications) {
      return '';
    }
    const hasComplementaryCertification = complementaryCertifications.some(
      (complementaryCertification: any) => complementaryCertification.name === certificationLabel
    );
    return hasComplementaryCertification ? 'oui' : '';
  }

  static fromCertificationCandidateAndCandidateNumber(certificationCandidate: any, number: any) {
    return new CandidateData({ ...certificationCandidate, number });
  }

  static empty(number: any) {
    return new CandidateData({ number });
  }
};
