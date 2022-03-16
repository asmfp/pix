// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'convertDat... Remove this comment to see the full error message
const { convertDateValue } = require('../../utils/date-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CLEA'.
const { CLEA, PIX_PLUS_DROIT } = require('../../../domain/models/ComplementaryCertification');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'featureTog... Remove this comment to see the full error message
const { featureToggles } = require('../../../config');

// These are transformation structures. They provide all the necessary info
// on how to transform cell values in an attendance sheet into a target JS object.
// Such a structure is an array holding objects with 3 properties. One object
// represents the transformation formula for one specific column in the ods file.
// Those 3 properties are:
//  - header -> Header in the ods file under which the cell values will be found
//  - property -> Property name of the target object in which the value will be put
//  - transformFn -> Transformation function through which the cell value will be processed into the final value
const _TRANSFORMATION_STRUCT_FOR_PIX_CERTIF_CANDIDATES_IMPORT = [
  {
    header: '* Nom de naissance',
    property: 'lastName',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: '* Prénom',
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
    header: '* Date de naissance (format : jj/mm/aaaa)',
    property: 'birthdate',
    transformFn: (cellVal: any) => {
      return convertDateValue({ dateString: cellVal, inputFormat: 'DD/MM/YYYY', outputFormat: 'YYYY-MM-DD' });
    },
  },
  {
    header: 'Nom de la commune',
    property: 'birthCity',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Code postal',
    property: 'birthPostalCode',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Code Insee',
    property: 'birthINSEECode',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'Pays',
    property: 'birthCountry',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'E-mail de convocation',
    property: 'email',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: 'E-mail du destinataire des résultats (formateur, enseignant…)',
    property: 'resultRecipientEmail',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
  {
    header: '* Sexe (M ou F)',
    property: 'sex',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  },
];

// ALL
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getTransfo... Remove this comment to see the full error message
function getTransformationStructsForPixCertifCandidatesImport({
  complementaryCertifications,
  isSco
}: any) {
  const transformationStruct = [..._TRANSFORMATION_STRUCT_FOR_PIX_CERTIF_CANDIDATES_IMPORT];

  if (featureToggles.isComplementaryCertificationSubscriptionEnabled) {
    _includeComplementaryCertificationColumns(complementaryCertifications, transformationStruct);
  }

  if (featureToggles.isCertificationBillingEnabled && !isSco) {
    _includeBillingColumns(transformationStruct);
  }

  return {
    transformStruct: transformationStruct,
    headers: _getHeadersFromTransformationStruct(transformationStruct),
  };
}

function _includeComplementaryCertificationColumns(complementaryCertifications: any, transformationStruct: any) {
  const containsClea = complementaryCertifications.some(
    (complementaryCertification: any) => complementaryCertification.name === CLEA
  );
  const containsPixPlusDroit = complementaryCertifications.some(
    (complementaryCertification: any) => complementaryCertification.name === PIX_PLUS_DROIT
  );

  if (containsClea) {
    transformationStruct.push({
      header: 'CléA Numérique\n("oui" ou laisser vide)',
      property: 'hasCleaNumerique',
      transformFn: _toBooleanIfValueEqualsOuiOrNull,
    });
  }

  if (containsPixPlusDroit) {
    transformationStruct.push({
      header: 'Pix+ Droit\n("oui" ou laisser vide)',
      property: 'hasPixPlusDroit',
      transformFn: _toBooleanIfValueEqualsOuiOrNull,
    });
  }
}

function _includeBillingColumns(transformationStruct: any) {
  transformationStruct.push({
    header: 'Tarification part Pix',
    property: 'billingMode',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  });
  transformationStruct.push({
    header: 'Code de prépaiement',
    property: 'prepaymentCode',
    transformFn: _toNotEmptyTrimmedStringOrNull,
  });
}

function _toNotEmptyTrimmedStringOrNull(val: any) {
  const value = _.toString(val);
  const trimmedValue = _.trim(value);
  return _.isEmpty(trimmedValue) ? null : trimmedValue;
}

function _toNonZeroValueOrNull(val: any) {
  const value = _.toNumber(val);
  return _.isNaN(value) ? null : value === 0 ? null : value;
}

function _getHeadersFromTransformationStruct(transformationStruct: any) {
  return _.map(transformationStruct, 'header');
}

function _toBooleanIfValueEqualsOuiOrNull(val: any) {
  return _.toUpper(val) === 'OUI' ? true : null;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getTransformationStructsForPixCertifCandidatesImport,
};
