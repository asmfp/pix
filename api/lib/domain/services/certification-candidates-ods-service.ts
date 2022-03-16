// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'readOdsUti... Remove this comment to see the full error message
const readOdsUtils = require('../../infrastructure/utils/ods/read-ods-utils');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getTransfo... Remove this comment to see the full error message
  getTransformationStructsForPixCertifCandidatesImport,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../infrastructure/files/candidates-import/candidates-import-transformation-structures');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../models/CertificationCandidate');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CLEA'.
const { CLEA, PIX_PLUS_DROIT } = require('../models/ComplementaryCertification');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCandidatesImportError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  extractCertificationCandidatesFromCandidatesImportSheet,
};

async function extractCertificationCandidatesFromCandidatesImportSheet({
  sessionId,
  isSco,
  odsBuffer,
  certificationCpfService,
  certificationCpfCountryRepository,
  certificationCpfCityRepository,
  complementaryCertificationRepository,
  certificationCenterRepository
}: any) {
  const certificationCenter = await certificationCenterRepository.getBySessionId(sessionId);
  const candidateImportStructs = getTransformationStructsForPixCertifCandidatesImport({
    complementaryCertifications: certificationCenter.habilitations,
    isSco,
  });
  try {
    await readOdsUtils.validateOdsHeaders({
      odsBuffer,
      headers: candidateImportStructs.headers,
    });
  } catch (err) {
    _handleVersionError();
  }
  const tableHeaderTargetPropertyMap = candidateImportStructs.transformStruct;
  let certificationCandidatesDataByLine = null;
  try {
    certificationCandidatesDataByLine = await readOdsUtils.extractTableDataFromOdsFile({
      odsBuffer,
      tableHeaderTargetPropertyMap,
    });
  } catch (err) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    _handleParsingError(err);
  }

  certificationCandidatesDataByLine = _filterOutEmptyCandidateData(certificationCandidatesDataByLine);

  return await bluebird.mapSeries(
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    Object.entries(certificationCandidatesDataByLine),
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'line' implicitly has an 'any' typ... Remove this comment to see the full error message
    async ([line, certificationCandidateData]) => {
      let { sex, birthCountry, birthINSEECode, birthPostalCode, birthCity, billingMode } = certificationCandidateData;
      const { hasCleaNumerique, hasPixPlusDroit } = certificationCandidateData;

      if (certificationCandidateData.sex?.toUpperCase() === 'M') sex = 'M';
      if (certificationCandidateData.sex?.toUpperCase() === 'F') sex = 'F';

      const cpfBirthInformation = await certificationCpfService.getBirthInformation({
        ...certificationCandidateData,
        certificationCpfCityRepository,
        certificationCpfCountryRepository,
      });

      if (cpfBirthInformation.hasFailed()) {
        _handleBirthInformationValidationError(cpfBirthInformation, line);
      }

      birthCountry = cpfBirthInformation.birthCountry;
      birthINSEECode = cpfBirthInformation.birthINSEECode;
      birthPostalCode = cpfBirthInformation.birthPostalCode;
      birthCity = cpfBirthInformation.birthCity;

      const complementaryCertifications = await _buildComplementaryCertificationsForLine({
        hasCleaNumerique,
        hasPixPlusDroit,
        complementaryCertificationRepository,
      });

      if (billingMode) {
        billingMode = CertificationCandidate.translateBillingMode(billingMode);
      }

      const certificationCandidate = new CertificationCandidate({
        ...certificationCandidateData,
        birthCountry,
        birthINSEECode,
        birthPostalCode,
        birthCity,
        sex,
        sessionId,
        complementaryCertifications,
        billingMode,
      });

      try {
        certificationCandidate.validate(isSco);
      } catch (err) {
        _handleFieldValidationError(err, tableHeaderTargetPropertyMap, line);
      }

      return certificationCandidate;
    }
  );
}

function _filterOutEmptyCandidateData(certificationCandidatesData: any) {
  return _(certificationCandidatesData)
    .mapValues(_nullifyObjectWithOnlyNilValues)
    .pickBy((value: any) => !_.isNull(value))
    .value();
}

function _nullifyObjectWithOnlyNilValues(data: any) {
  for (const propName in data) {
    if (!_.isNil(data[propName])) {
      return data;
    }
  }
  return null;
}

function _handleFieldValidationError(err: any, tableHeaderTargetPropertyMap: any, line: any) {
  const keyLabelMap = tableHeaderTargetPropertyMap.reduce((acc: any, obj: any) => {
    acc[obj.property] = obj.header;
    return acc;
  }, {});
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
  line = parseInt(line) + 1;
  throw CertificationCandidatesImportError.fromInvalidCertificationCandidateError(err, keyLabelMap, line);
}

function _handleBirthInformationValidationError(cpfBirthInformation: any, line: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
  line = parseInt(line) + 1;
  throw new CertificationCandidatesImportError({ message: `Ligne ${line} : ${cpfBirthInformation.message}` });
}

function _handleVersionError() {
  throw new CertificationCandidatesImportError({
    code: 'INVALID_DOCUMENT',
    message: 'La version du document est inconnue.',
  });
}

function _handleParsingError() {
  throw new CertificationCandidatesImportError({ code: 'INVALID_DOCUMENT', message: 'Le document est invalide.' });
}

async function _buildComplementaryCertificationsForLine({
  hasCleaNumerique,
  hasPixPlusDroit,
  complementaryCertificationRepository
}: any) {
  const complementaryCertifications = [];
  const complementaryCertificationsInDB = await complementaryCertificationRepository.findAll();
  if (hasCleaNumerique) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
    complementaryCertifications.push(
      complementaryCertificationsInDB.find((complementaryCertification: any) => complementaryCertification.name === CLEA)
    );
  }
  if (hasPixPlusDroit) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
    complementaryCertifications.push(
      complementaryCertificationsInDB.find(
        (complementaryCertification: any) => complementaryCertification.name === PIX_PLUS_DROIT
      )
    );
  }
  return complementaryCertifications;
}
