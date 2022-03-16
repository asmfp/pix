// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCourseRepository = require('../../../lib/infrastructure/repositories/certification-course-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificateVerificationCodeGenerationTooManyTrials } = require('../../../lib/domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'config'.
const config = require('../../config');

const availableCharacters =
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'split' does not exist on type 'string'.
  `${config.availableCharacterForCode.numbers}${config.availableCharacterForCode.letters}`.split('');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NB_CHAR'.
const NB_CHAR = 8;
const NB_OF_TRIALS = 1000;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_generateC... Remove this comment to see the full error message
function _generateCode() {
  return 'P-' + _.times(NB_CHAR, _randomCharacter).join('');
}

function _randomCharacter() {
  return _.sample(availableCharacters);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async generateCertificateVerificationCode(generateCode = _generateCode) {
    for (let i = 0; i < NB_OF_TRIALS; i++) {
      const code = generateCode();
      const isCodeAvailable = await certificationCourseRepository.isVerificationCodeAvailable(code);
      if (isCodeAvailable) return code;
    }
    throw new CertificateVerificationCodeGenerationTooManyTrials(NB_OF_TRIALS);
  },
};
