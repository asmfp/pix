// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'config'.
const config = require('../../config');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sessionRep... Remove this comment to see the full error message
const sessionRepository = require('../../infrastructure/repositories/sessions/session-repository');

function _randomLetter() {
  const letters = config.availableCharacterForCode.letters.split('');
  return _.sample(letters);
}

function _randomNumberCharacter() {
  const numberCharacter = config.availableCharacterForCode.numbers.split('');
  return _.sample(numberCharacter);
}

function _generateSessionCode() {
  const code =
    '' +
    _randomLetter() +
    _randomLetter() +
    _randomLetter() +
    _randomLetter() +
    _randomNumberCharacter() +
    _randomNumberCharacter();
  return code;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getNewSessionCode() {
    const newSessionCode = _generateSessionCode();
    const codeAvailable = await sessionRepository.isSessionCodeAvailable(newSessionCode);
    return codeAvailable ? newSessionCode : this.getNewSessionCode();
  },
};
