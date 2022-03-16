// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer, Deserializer } = require('jsonapi-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../../../domain/models/CertificationCandidate');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'WrongDateF... Remove this comment to see the full error message
const { WrongDateFormatError } = require('../../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isValidDat... Remove this comment to see the full error message
const { isValidDate } = require('../../utils/date-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificationCandidates: any) {
    return new Serializer('certification-candidate', {
      transform: function (certificationCandidate: any) {
        return {
          ...certificationCandidate,
          billingMode: certificationCandidate.translatedBillingMode,
          isLinked: !_.isNil(certificationCandidate.userId),
        };
      },
      attributes: [
        'firstName',
        'lastName',
        'birthdate',
        'birthProvinceCode',
        'birthCity',
        'birthCountry',
        'email',
        'resultRecipientEmail',
        'externalId',
        'extraTimePercentage',
        'isLinked',
        'schoolingRegistrationId',
        'sex',
        'birthINSEECode',
        'birthPostalCode',
        'complementaryCertifications',
        'billingMode',
        'prepaymentCode',
      ],
    }).serialize(certificationCandidates);
  },

  async deserialize(json: any) {
    if (json.data.attributes.birthdate && !isValidDate(json.data.attributes.birthdate, 'YYYY-MM-DD')) {
      throw new WrongDateFormatError(
        "La date de naissance du candidate à la certification n'a pas un format valide du type JJ/MM/AAAA"
      );
    }

    delete json.data.attributes['is-linked'];

    const deserializer = new Deserializer({ keyForAttribute: 'camelCase' });
    const deserializedCandidate = await deserializer.deserialize(json);
    deserializedCandidate.birthINSEECode = deserializedCandidate.birthInseeCode;
    delete deserializedCandidate.birthInseeCode;

    return new CertificationCandidate(deserializedCandidate);
  },
};
