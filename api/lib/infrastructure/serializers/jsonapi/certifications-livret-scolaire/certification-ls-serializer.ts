// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'attributes... Remove this comment to see the full error message
const attributes = [
  'firstName',
  'middleName',
  'thirdName',
  'lastName',
  'birthdate',
  'nationalStudentId',
  'status',
  'pixScore',
  'verificationCode',
  'date',
  'deliveredAt',
  'competenceResults',
  'certificationCenter',
];

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificate: any) {
    return new Serializer('certificationsResults', {
      attributes: ['certifications', 'competences'],
      certifications: {
        attributes: [...attributes],
        competenceResults: {
          attributes: ['competence-id', 'level'],
        },
      },
      competences: {
        ref: 'id',
        attributes: ['name', 'area'],
        area: {
          ref: 'id',
          attributes: ['name'],
        },
      },
    }).serialize(certificate);
  },
};
