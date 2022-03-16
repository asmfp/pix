// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const bcrypt = require('bcrypt');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { bcryptNumberOfSaltRounds } = require('../../config');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PasswordNo... Remove this comment to see the full error message
const PasswordNotMatching = require('../errors').PasswordNotMatching;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  hashPassword: (password: any) => bcrypt.hash(password, bcryptNumberOfSaltRounds),

  /* eslint-disable-next-line no-sync */
  hashPasswordSync: (password: any) => bcrypt.hashSync(password, bcryptNumberOfSaltRounds),

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  checkPassword: async ({
    password,
    passwordHash
  }: any) => {
    const matching = await bcrypt.compare(password, passwordHash);
    if (!matching) {
      throw new PasswordNotMatching();
    }
  },
};
