// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'FileValida... Remove this comment to see the full error message
const { FileValidationError, SiecleXmlImportError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs').promises;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { SCHOOLING_REGISTRATION_CHUNK_SIZE } = require('../../infrastructure/constants');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isEmpty'.
const { isEmpty, chunk } = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  EMPTY: 'EMPTY',
  INVALID_FILE_EXTENSION: 'INVALID_FILE_EXTENSION',
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function importSchoolingRegistrationsFromSIECLEFormat({
  organizationId,
  payload,
  format,
  schoolingRegistrationsCsvService,
  schoolingRegistrationsXmlService,
  schoolingRegistrationRepository,
  organizationRepository,
  i18n
}: any) {
  let schoolingRegistrationData = [];

  const organization = await organizationRepository.get(organizationId);
  const path = payload.path;

  if (format === 'xml') {
    schoolingRegistrationData =
      await schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE(path, organization);
  } else if (format === 'csv') {
    schoolingRegistrationData = await schoolingRegistrationsCsvService.extractSchoolingRegistrationsInformation(
      path,
      organization,
      i18n
    );
  } else {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'INVALID_FILE_EXTENSION' does not exist o... Remove this comment to see the full error message
    throw new FileValidationError(ERRORS.INVALID_FILE_EXTENSION, { fileExtension: format });
  }

  fs.unlink(payload.path);

  if (isEmpty(schoolingRegistrationData)) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new SiecleXmlImportError(ERRORS.EMPTY);
  }

  const schoolingRegistrationsChunks = chunk(schoolingRegistrationData, SCHOOLING_REGISTRATION_CHUNK_SIZE);

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  return DomainTransaction.execute(async (domainTransaction: any) => {
    await schoolingRegistrationRepository.disableAllSchoolingRegistrationsInOrganization({
      domainTransaction,
      organizationId,
    });

    await bluebird.mapSeries(schoolingRegistrationsChunks, (chunk: any) => {
      return schoolingRegistrationRepository.addOrUpdateOrganizationSchoolingRegistrations(
        chunk,
        organizationId,
        domainTransaction
      );
    });
  });
};
