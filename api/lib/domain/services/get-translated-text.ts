// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ENGLISH_SP... Remove this comment to see the full error message
const { ENGLISH_SPOKEN } = require('../../domain/constants').LOCALE;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getTransla... Remove this comment to see the full error message
function getTranslatedText(locale: any, translations = { frenchText: '', englishText: '' }) {
  if (locale === ENGLISH_SPOKEN) {
    return translations.englishText;
  }

  return translations.frenchText;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { getTranslatedText };
